import React, {useState, useCallback, useEffect, useContext} from 'react';
import {BackHandler, DeviceEventEmitter, Keyboard} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header, Input, Alert, LoadingAlert} from '../../components';
import styles, {
  Root,
  FlexScroll,
  BackGround,
  CircleView,
  ImageCircle,
  SupportLine,
  OpacityCircle,
} from './styles';
import {Color, StorageKey} from '../../values';
import * as ImagePicker from 'react-native-image-picker';
import {store, storage} from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScreenNames} from '../../navigation/Stack';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import {GlobalData} from '../../context';

let clickable = false;

interface Props {
  navigation: StackNavigationHelpers;
  route: any;
}

export default function ({navigation, route}: Props) {
  const {network, showNetworkAlert} = useContext(GlobalData);

  const [image_upload, set_image_upload] = useState<boolean>(false);
  const [save_data, set_save_data] = useState<boolean>(false);
  const [no_all_input, set_no_all_input] = useState<boolean>(false);
  const [nick_duplicate, set_nick_duplicate] = useState<boolean>(false);
  const [error, set_error] = useState<boolean>(false);
  const [nick, set_nick] = useState<string>(
    route.params?.nick_name ? route.params.nick_name : '',
  );
  const [car_number, set_car_number] = useState<string>(
    route.params?.car_number ? route.params.car_number : '',
  );
  const [car_name, set_car_name] = useState<string>(
    route.params?.car_name ? route.params.car_name : '',
  );
  const [image_uri, set_image_uri] = useState<string>(
    route.params?.profile_image
      ? route.params.profile_image + '&' + Date.now()
      : '',
  );

  const onImageLibraryPress = useCallback(() => {
    if (clickable) {
      return;
    }
    clickable = true;
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    // @ts-ignore
    ImagePicker.launchImageLibrary(options, data => {
      if (data?.assets) {
        set_image_uri(data.assets[0].uri as string);
      }
    });
    setTimeout(() => {
      clickable = false;
    }, 3000);
  }, []);
  const accession = useCallback(() => {
    if (route.params?.edit) {
      store
        .editData(route.params.uid, {
          nick,
          car_number,
          car_name,
          image_uri:
            image_uri &&
            'https://firebasestorage.googleapis.com/v0/b/hereparking-7c86f.appspot.com/o/users%2F' +
              route.params.uid +
              '?alt=media',
        })
        .then(s => {
          set_save_data(false);
          if (!s) {
            set_error(true);
          } else {
            DeviceEventEmitter.emit('refresh_user');
            navigation.goBack();
          }
        });
    } else {
      store
        .initData(route.params.uid, {
          nick,
          car_number,
          car_name,
          image_uri:
            image_uri &&
            'https://firebasestorage.googleapis.com/v0/b/hereparking-7c86f.appspot.com/o/users%2F' +
              route.params.uid +
              '?alt=media',
          phone_number: route.params.phone_number,
        })
        .then(s => {
          set_save_data(false);
          if (!s) {
            set_error(true);
          } else {
            AsyncStorage.setItem(StorageKey.uid, route.params.uid).then(__ => {
              navigation.reset({routes: [{name: ScreenNames.Home}]});
            });
          }
        });
    }
  }, [car_name, car_number, image_uri, nick]);

  useEffect(() => {
    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, []);

  return (
    <Root>
      <LoadingAlert
        visible={image_upload}
        setVisible={set_image_upload}
        res={'이미지를 업로드 하는 중입니다...'}
      />
      <LoadingAlert
        visible={save_data}
        setVisible={set_save_data}
        res={'정보를 저장하는 중입니다...'}
      />
      <Alert
        visible={no_all_input}
        setVisible={set_no_all_input}
        res={'닉네임, 차량 번호, 차량 종류를 모두 입력해수제요.'}
      />
      <Alert
        visible={nick_duplicate}
        setVisible={set_nick_duplicate}
        res={'닉네임이 중복되었습니다. 다른 닉네임을 입력해주세요.'}
      />
      <Alert
        visible={error}
        setVisible={set_error}
        res={'에러가 발생했습니다. 다시 시도해주세요.'}
      />
      <Header
        viewText={route.params?.edit ? '정보수정' : '회원가입'}
        nextText={route.params?.edit ? '수정' : '가입'}
        nextPress={() => {
          Keyboard.dismiss();
          if (!network) {
            showNetworkAlert(true);
          } else {
            if (!nick.trim() || !car_number.trim()) {
              set_no_all_input(true);
            } else if (!car_name.trim()) {
              set_no_all_input(true);
            } else {
              set_save_data(true);
              store.nick_duplicate_check(nick.trim()).then(s => {
                if (!s.status) {
                  set_save_data(false);
                  set_error(true);
                } else if (s.info && !route.params?.nick_name) {
                  set_save_data(false);
                  set_nick_duplicate(true);
                } else {
                  if (image_uri && !image_uri.startsWith('https://')) {
                    set_save_data(false);
                    set_image_upload(true);
                    storage
                      .uploadImage(route.params.uid, image_uri)
                      .then(status => {
                        set_image_upload(false);
                        if (!status) {
                          set_error(true);
                        } else {
                          set_save_data(true);
                          accession();
                        }
                      });
                  } else {
                    accession();
                  }
                }
              });
            }
          }
        }}
        backPress={() => navigation.goBack()}
      />
      <FlexScroll>
        <BackGround>
          <TouchableRipple
            style={styles.rippleView}
            onPress={onImageLibraryPress}
            borderless={true}>
            {image_uri ? (
              <ImageCircle
                source={{
                  uri: image_uri,
                }}
                resizeMode={'cover'}>
                <OpacityCircle>
                  <MaterialCommunityIcons
                    name={'camera-plus'}
                    size={26}
                    style={styles.icon}
                    color={Color.White}
                  />
                </OpacityCircle>
              </ImageCircle>
            ) : (
              <CircleView>
                <MaterialCommunityIcons
                  name={'camera-plus'}
                  size={26}
                  style={styles.icon}
                  color={Color.White}
                />
              </CircleView>
            )}
          </TouchableRipple>
          <Input
            placeholder={'닉네임을 입력해주세요.'}
            style={styles.inputView}
            maxLength={8}
            value={nick}
            onChangeText={set_nick}
          />
          <SupportLine />
          <Input
            placeholder={'차량 번호를 입력해주세요.'}
            maxLength={12}
            value={car_number}
            onChangeText={set_car_number}
          />
          <Input
            placeholder={'차량 종류를 입력해주세요. (ex. 제네시스)'}
            maxLength={12}
            value={car_name}
            onChangeText={set_car_name}
          />
        </BackGround>
      </FlexScroll>
    </Root>
  );
}
