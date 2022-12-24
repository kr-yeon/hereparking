import React, {useCallback, useContext, useEffect, useState} from 'react';
import styles, {HorizonView, Line, Res, Root, Text} from './styles';
import {Alert, Header, LoadingAlert, SelectAlert} from '../../components';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import { BackHandler, ToastAndroid } from "react-native";
import {Color, StorageKey} from '../../values';
import {TouchableRipple, Switch} from 'react-native-paper';
import {ScreenNames} from '../../navigation/Stack';
import {storage, store} from '../../firebase';
import {GlobalData} from '../../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { delChatList, delTokenList, set_notification } from "../../firebase/store";
import { Chat } from "../../chat";

interface Props {
  navigation: StackNavigationHelpers;
}

function sliceArray(arr: Array<any>, num: number) {
  const res: Array<Array<any>> = [];

  for (let i = 0; i < arr.length / num; i++) {
    res.push(arr.slice(i * num, (i + 1) * num));
  }

  return res;
}

export default function ({navigation}: Props) {
  const {network, showNetworkAlert, uid} = useContext(GlobalData);

  const [notification, setNotification] = useState<boolean>(true);
  const [secession, setSecession] = useState<boolean>(false);
  const [delImage, setDelImage] = useState<boolean>(false);
  const [delInfo, setDelInfo] = useState<boolean>(false);
  const [noInfo, setNoInfo] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [logout, setLogout] = useState<boolean>(false);

  const secessionWriting = useCallback(
    async (data: store.UserInfo) => {
      for (const l of sliceArray(data.writing_list, 2)) {
        await Promise.all(
          l.map(i =>
            storage.del_image(i).then(ss => {
              if (ss) {
                store.del_writing(uid, i).then(sss => {
                  if (!sss) {
                    setDelImage(false);
                    setError(true);
                  }
                });
              } else {
                setDelImage(false);
                setError(true);
              }
            }),
          ),
        );
      }
    },
    [uid],
  );

  useEffect(() => {
    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    store.get_user(uid).then(s => {
      if (s.status || !network) {
        setNotification(s.data!.notification);
      } else {
        ToastAndroid.show(
          '정보를 불러오는 도중 오류가 발생했습니다.',
          ToastAndroid.SHORT,
        );
        navigation.goBack();
      }
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <Root>
      <SelectAlert
        res={'정말 탈퇴하시겠습니까?'}
        visible={secession}
        setVisible={setSecession}
        onSuccess={() => {
          setSecession(false);
          if (!network) {
            showNetworkAlert(true);
          } else {
            setDelInfo(true);
            store.get_user(uid).then(s => {
              if (s.status) {
                const data = s.data as store.UserInfo;

                setDelInfo(false);
                setDelImage(true);

                secessionWriting(data).then(_ => {
                  storage.del_user_image(uid).then(r => {
                    setDelImage(false);
                    if (r || !s.data?.profile_image) {
                      setDelInfo(true);
                      store.secession(uid).then(rr => {
                        if (!rr) {
                          setDelInfo(false);
                          setError(true);
                        } else {
                          for (let i = 0; i < data.chat_list.length; i++) {
                            delChatList(uid, data.chat_list[i]).then(__ => {
                              new Chat(uid, data.chat_list[i]).quit();
                            });
                          }
                          setDelInfo(false);
                          AsyncStorage.removeItem(StorageKey.uid).then(() => {
                            navigation.reset({
                              routes: [{name: ScreenNames.Login}],
                            });
                          });
                        }
                      });
                    } else {
                      setDelInfo(false);
                      setError(true);
                    }
                  });
                });
              } else {
                setDelInfo(false);
                setNoInfo(true);
              }
            });
          }
        }}
      />
      <SelectAlert
        res={'정말 로그아웃하시겠습니까?'}
        visible={logout}
        setVisible={setLogout}
        onSuccess={() => {
          AsyncStorage.removeItem(StorageKey.uid).then(() => {
            delTokenList(uid);
            setLogout(false);
            navigation.reset({
              routes: [{name: ScreenNames.Login}],
            });
          });
        }}
      />
      <LoadingAlert
        res={'정보를 삭제하고 있습니다.'}
        visible={delInfo}
        setVisible={setDelInfo}
      />
      <LoadingAlert
        res={'이미지를 삭제하고 있습니다.'}
        visible={delImage}
        setVisible={setDelImage}
      />
      <Alert
        res={'유저 정보를 불러올 수 없습니다.'}
        visible={noInfo}
        setVisible={setNoInfo}
      />
      <Alert
        res={'오류가 발생했습니다.'}
        visible={error}
        setVisible={setError}
      />
      <Header viewText={'환경설정'} backPress={navigation.goBack} />
      <HorizonView>
        <Text>앱 버전</Text>
        <Res>1.0</Res>
      </HorizonView>
      <Line />
      <HorizonView>
        <Text>알림 설정</Text>
        <Switch
          value={notification}
          onValueChange={value => {
            if (!network) {
              showNetworkAlert(true);
              return;
            }
            setNotification(value);
            set_notification(uid, value).then(s => {
              if (!s) {
                showNetworkAlert(true);
                setNotification(!value);
              }
            });
          }}
          color={Color.ActiveColor}
          style={styles.switch}
        />
      </HorizonView>
      <Line />
      <TouchableRipple
        onPress={() => {
          navigation.navigate(ScreenNames.Certification, {edit: true});
        }}>
        <Text>전화번호 변경</Text>
      </TouchableRipple>
      <Line />
      <TouchableRipple
        onPress={() => {
          navigation.navigate(ScreenNames.Agreement, {check: true});
        }}>
        <Text>개인정보 처리 방침</Text>
      </TouchableRipple>
      <Line />
      <TouchableRipple
        onPress={() => {
          setLogout(true);
        }}>
        <Text color={Color.Red}>로그아웃</Text>
      </TouchableRipple>
      <Line />
      <TouchableRipple
        onPress={() => {
          setSecession(true);
        }}>
        <Text color={Color.CircleView}>계정탈퇴</Text>
      </TouchableRipple>
    </Root>
  );
}
