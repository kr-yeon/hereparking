import React, {useEffect, useContext, useState, useCallback} from 'react';
import {Color} from '../../values';
import PagerView from 'react-native-pager-view';
import styles, {
  DateText,
  Line,
  Root,
  Scroll,
  Text,
  TextView,
  InfoView,
  Res,
  TimeText,
  TimeView,
  LocationView,
  Line2,
  CopyButton,
  LocationText,
  BottomSheet,
  BottomText,
  BottomRes,
  BottomInfo,
  BottomButton,
  IconsView,
  Header,
  BannerImage,
  DotView,
  Dot,
  ScoreBox,
} from './styles';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BackHandler,
  DeviceEventEmitter,
  PermissionsAndroid,
  RefreshControl,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import {GlobalData} from '../../context';
import Clipboard from '@react-native-clipboard/clipboard';
import {storage, store} from '../../firebase';
import {LoadingAlert, Alert, SelectAlert} from '../../components';
import {ScreenNames} from '../../navigation/Stack';
import {MarkerImage} from '../Writing/styles';
import {chatDuplication, createRoom} from '../../chat';
import {addChatList, addNotification, get_user} from '../../firebase/store';
import {sendNotification} from '../../api';
import {NotificationChannels} from '../../api/sendNotification';

interface Props {
  navigation: StackNavigationHelpers;
  route: any;
}

function timeForToday(value: number): string {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60,
  );
  if (betweenTime < 1) {
    return '방금 전';
  }
  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일 전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년 전`;
}

function getMoney(start: string, end: string): string {
  const hours = Number(end.split(':')[0]) - Number(start.split(':')[0]);
  const minutes = Number(end.split(':')[1]) - Number(start.split(':')[1]);

  return (hours * 3000 + (minutes / 10) * 500)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function ({navigation, route}: Props) {
  const {uid, network, showNetworkAlert} = useContext(GlobalData);

  const [scrollY, setScrollY] = useState<number>(0);
  const [load, set_load] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isDel, setIsDel] = useState<boolean>(false);
  const [yesDel, setYesDel] = useState<boolean>(false);
  const [noDel, setNoDel] = useState<boolean>(false);
  const [noChange, setNoChange] = useState<boolean>(false);
  const [createChat, setCreateChat] = useState<boolean>(false);
  const [pagerSelect, setPagerSelect] = useState<number>(0);
  const [rankPoint, setRankPoint] = useState<string>('-');
  const [info, set_info] = useState<store.WritingInfo>({
    uid: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    address: {
      address: '',
      detail_address: '',
    },
    images: [],
    start_time: '',
    end_time: '',
    upload_time: 0,
    reservation: false,
  });

  const getWriting = useCallback(
    callback => {
      if (!network) {
        showNetworkAlert(true);
        navigation.goBack();
      } else {
        store.get_writing(route.params.id).then(s => {
          if (!s.status) {
            ToastAndroid.show('정보를 불러올 수 없습니다.', ToastAndroid.SHORT);
            navigation.goBack();
          } else {
            if (!s.data?.upload_time) {
              ToastAndroid.show(
                '정보를 불러올 수 없습니다.',
                ToastAndroid.SHORT,
              );
              navigation.goBack();
            } else {
              set_load(false);
              set_info(s.data as store.WritingInfo);
              callback();
              set_load(true);
            }
            store.get_user(info.uid).then(ss => {
              if (!ss.status) {
                ToastAndroid.show(
                  '정보를 불러올 수 없습니다.',
                  ToastAndroid.SHORT,
                );
                navigation.goBack();
              } else {
                if (!ss.data) {
                  return;
                }
                setRankPoint(ss.data!.rank_point);
              }
            });
          }
          setRefreshing(false);
        });
      }
    },
    [network, showNetworkAlert],
  );

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    getWriting(() => {
      set_load(true);
    });

    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    DeviceEventEmitter.addListener('refresh_read', _ => {
      if (!network) {
        showNetworkAlert(true);
      } else {
        store.get_writing(route.params.id).then(s => {
          if (s.status) {
            if (!s.data?.upload_time) {
              ToastAndroid.show(
                '정보를 불러올 수 없습니다.',
                ToastAndroid.SHORT,
              );
              navigation.goBack();
            } else {
              set_load(false);
              set_info(s.data as store.WritingInfo);
              set_load(true);
            }
          }
        });
      }
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      DeviceEventEmitter.removeAllListeners('refresh_read');
    };
  }, []);

  return load ? (
    <Root>
      <Header opacity={1 - (300 - scrollY) / 300} />
      <LoadingAlert
        res={'글을 삭제하는 중입니다...'}
        visible={isDel}
        setVisible={setIsDel}
      />
      <LoadingAlert
        res={'채팅방을 생성하고 있습니다...'}
        visible={createChat}
        setVisible={setCreateChat}
      />
      <Alert
        res={'글을 삭제하지 못했습니다.'}
        visible={noDel}
        setVisible={setNoDel}
      />
      <Alert
        res={'예약 상태 변경에 실패했습니다.'}
        visible={noChange}
        setVisible={setNoChange}
      />
      <SelectAlert
        res={'정말 삭제하시겠습니까?'}
        visible={yesDel}
        setVisible={setYesDel}
        onSuccess={() => {
          setYesDel(false);
          if (!network) {
            showNetworkAlert(true);
            return;
          }
          setIsDel(true);
          storage.del_image(route.params.id).then(ss => {
            if (ss) {
              store.del_writing(uid, route.params.id).then(s => {
                setIsDel(false);
                if (s) {
                  ToastAndroid.show('글이 삭제되었습니다.', ToastAndroid.SHORT);
                  navigation.goBack();
                  DeviceEventEmitter.emit('refresh_writings');
                  DeviceEventEmitter.emit('refresh_user');
                } else {
                  setNoDel(true);
                }
              });
            } else {
              setIsDel(false);
              setNoDel(true);
            }
          });
        }}
      />
      <TouchableRipple
        borderless={true}
        style={styles.headerButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <MaterialCommunityIcons
          name={'chevron-left'}
          size={30}
          style={{
            color: `rgb(${((300 - scrollY) / 300) * 255}, ${
              ((300 - scrollY) / 300) * 255
            }, ${((300 - scrollY) / 300) * 255})`,
          }}
        />
      </TouchableRipple>
      <Scroll
        onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              if (!network) {
                showNetworkAlert(true);
              } else {
                setRefreshing(true);
                getWriting(() => {});
              }
            }}
          />
        }>
        <View style={styles.pager_view}>
          <PagerView
            style={styles.pager_view}
            onPageSelected={e => {
              setPagerSelect(e.nativeEvent.position);
            }}>
            {info.images.map((image, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() =>
                  navigation.navigate(ScreenNames.SeeImage, {
                    images: info.images.map(s => s + '&' + info.upload_time),
                    select: index,
                  })
                }>
                <BannerImage
                  source={{uri: image + '&' + info.upload_time}}
                  resizeMode={'cover'}
                />
              </TouchableWithoutFeedback>
            ))}
          </PagerView>
          <DotView>
            {info.images.map((image, index) => (
              <Dot
                size={index === pagerSelect ? 8 : 7}
                color={index === pagerSelect ? Color.ActiveColor : Color.White}
                key={index}
              />
            ))}
          </DotView>
        </View>
        <TextView>
          <Text>{info.address.address}</Text>
          <DateText>
            {(() => {
              const date = new Date(info.upload_time);

              return (
                date.getFullYear() +
                '.' +
                (date.getMonth() + 1) +
                '.' +
                date.getDate()
              );
            })()}
          </DateText>
        </TextView>
        <Line />
        <TextView>
          <InfoView>
            <Text>상품 정보</Text>
            <TimeView>
              <Res>이용 가능 시간</Res>
              <TimeText>
                {info.start_time} ~ {info.end_time}
              </TimeText>
            </TimeView>
          </InfoView>
          {uid === info.uid ? (
            <IconsView>
              <TouchableRipple
                onPress={() => {
                  if (!network) {
                    showNetworkAlert(true);
                  } else {
                    navigation.navigate(ScreenNames.Writing, {
                      id: route.params.id,
                      images: info.images,
                      address: info.address,
                      location: info.location,
                      start_time: info.start_time,
                      end_time: info.end_time,
                    });
                  }
                }}
                style={styles.icons}>
                <MaterialCommunityIcons
                  name={'pen'}
                  size={19}
                  color={Color.Res}
                />
              </TouchableRipple>
              <TouchableRipple
                onPress={() => setYesDel(true)}
                style={styles.icons}>
                <MaterialCommunityIcons
                  name={'trash-can-outline'}
                  size={19}
                  color={Color.Res}
                />
              </TouchableRipple>
            </IconsView>
          ) : null}
        </TextView>
        <Line2 />
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            ...info.location,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userInterfaceStyle={'light'}>
          <Marker
            coordinate={{
              ...info.location,
            }}>
            <MarkerImage
              resizeMode={'center'}
              source={require('../../assets/images/marker.png')}
            />
          </Marker>
        </MapView>
        <LocationView>
          <MaterialCommunityIcons
            name={'map-marker-outline'}
            size={21}
            color={Color.Black}
            style={styles.location_icon}
          />
          <InfoView>
            <LocationText style={styles.delPadding}>
              {info.address.address}
            </LocationText>
            <Res style={styles.delPadding}>{info.address.detail_address}</Res>
          </InfoView>
          <TouchableRipple
            style={styles.rippleView}
            borderless={true}
            onPress={() => {
              ToastAndroid.show('주소가 복사되었습니다.', ToastAndroid.SHORT);
              Clipboard.setString(info.address.address);
            }}>
            <CopyButton>주소 복사하기</CopyButton>
          </TouchableRipple>
        </LocationView>
      </Scroll>
      <BottomSheet>
        <BottomInfo>
          <ScoreBox>{rankPoint}</ScoreBox>
          <BottomText>{getMoney(info.start_time, info.end_time)}원</BottomText>
          <BottomRes>{timeForToday(info.upload_time)}</BottomRes>
        </BottomInfo>
        <TouchableRipple
          style={styles.bottomRippleView}
          borderless={true}
          disabled={uid !== info.uid && info.reservation}
          onPress={() => {
            if (uid !== info.uid) {
              setCreateChat(true);
              get_user(uid).then(udata => {
                if (!udata.status) {
                  setCreateChat(false);
                  ToastAndroid.show(
                    '정보를 불러오지 못했습니다.',
                    ToastAndroid.SHORT,
                  );
                } else {
                  chatDuplication(udata.data!.chat_list, [uid, info.uid]).then(
                    (dulication: {status: boolean; data?: string}) => {
                      if (dulication.status) {
                        if (dulication.data) {
                          setCreateChat(false);
                          navigation.navigate(ScreenNames.Chatting, {
                            id: dulication.data,
                          });
                        } else {
                          createRoom(uid, '', [uid, info.uid], '', {
                            writing: route.params.id,
                          }).then((s: boolean | string) => {
                            if (!network || !s) {
                              setCreateChat(false);
                              showNetworkAlert(true);
                            } else {
                              addChatList(uid, s as string).then(_ => {
                                addChatList(info.uid, s as string).then(__ => {
                                  get_user(info.uid).then(iudata => {
                                    if (iudata.status) {
                                      if (iudata.data!.notification) {
                                        sendNotification(
                                          iudata.data!.token_list,
                                          '채팅방이 생성되었습니다.',
                                          udata.data!.nick_name +
                                            '님과의 채팅방이 생성되었습니다.',
                                          NotificationChannels.createChat,
                                          {
                                            roomId: s,
                                          },
                                        );
                                      }
                                      addNotification(uid, {
                                        title: '새로운 대화가 시작되었습니다.',
                                        res:
                                          iudata.data!.nick_name +
                                          '님과의 채팅방이 생성되었습니다.',
                                        time: Date.now(),
                                      });
                                    }
                                  });
                                  if (udata.status) {
                                    addNotification(info.uid, {
                                      title: '새로운 대화가 시작되었습니다.',
                                      res:
                                        udata.data!.nick_name +
                                        '님과의 채팅방이 생성되었습니다.',
                                      time: Date.now(),
                                    });
                                  }
                                  setCreateChat(false);
                                  ToastAndroid.show(
                                    '방이 생성되었습니다.',
                                    ToastAndroid.SHORT,
                                  );
                                  navigation.navigate(ScreenNames.Chatting, {
                                    id: s,
                                  });
                                });
                              });
                            }
                          });
                        }
                      } else {
                        ToastAndroid.show(
                          '정보를 불러오지 못했습니다.',
                          ToastAndroid.SHORT,
                        );
                      }
                    },
                  );
                }
              });
            } else {
              if (info.reservation) {
                if (!network) {
                  showNetworkAlert(true);
                }
                store.set_reservation(route.params.id, false).then(s => {
                  if (!s) {
                    setNoChange(true);
                  } else {
                    set_info({
                      ...info,
                      reservation: false,
                    });
                    DeviceEventEmitter.emit('refresh_writings');
                    DeviceEventEmitter.emit('refresh_user');
                  }
                });
              } else {
                if (!network) {
                  showNetworkAlert(true);
                }
                store.set_reservation(route.params.id, true).then(s => {
                  if (!s) {
                    setNoChange(true);
                  } else {
                    set_info({
                      ...info,
                      reservation: true,
                    });
                    DeviceEventEmitter.emit('refresh_writings');
                    DeviceEventEmitter.emit('refresh_user');
                  }
                });
              }
            }
          }}>
          <BottomButton
            style={
              uid !== info.uid && info.reservation ? styles.button_disable : {}
            }>
            {uid === info.uid
              ? info.reservation
                ? '예약 취소'
                : '예약 완료'
              : '채팅하기'}
          </BottomButton>
        </TouchableRipple>
      </BottomSheet>
    </Root>
  ) : null;
}
