import React, {useState, useEffect, useRef, useContext} from 'react';
import styles, {Root, WriteCircle} from './styles';
import {TouchableRipple} from 'react-native-paper';
import {Alert, LogoHeader} from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Color} from '../../values';
import {ParkElement} from '../../components';
import {ScreenNames} from '../../navigation/Stack';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import {store} from '../../firebase';
import {
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import {GlobalData} from '../../context';
import {addTokenList} from '../../firebase/store';

interface Props {
  stack_navigation: StackNavigationHelpers;
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

export default function ({stack_navigation}: Props) {
  const {uid, network, showNetworkAlert} = useContext(GlobalData);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [no_load, set_no_load] = useState<boolean>(false);
  const [writingsData, setWritingsData] = useState<Array<store.WritingInfoId>>(
    [],
  );

  const isEnd = useRef<boolean>(false);

  useEffect(() => {
    if (!network) {
      showNetworkAlert(true);
    } else {
      store.get_writings().then(s => {
        if (s.status) {
          isEnd.current = false;
          if (s.data!.length === 0) {
            ToastAndroid.show(
              '주차장이 존재하지 않습니다.',
              ToastAndroid.SHORT,
            );
          }
          setWritingsData(s.data as Array<store.WritingInfoId>);
        } else {
          set_no_load(true);
        }
      });
      addTokenList(uid);
    }

    DeviceEventEmitter.addListener('refresh_writings', _ => {
      if (!network) {
        showNetworkAlert(true);
      } else {
        store.get_writings().then(s => {
          if (s.status) {
            isEnd.current = false;
            setWritingsData(s.data as Array<store.WritingInfoId>);
          } else {
            set_no_load(true);
          }
        });
      }
    });

    return () => DeviceEventEmitter.removeAllListeners('refresh_writings');
  }, []);

  return (
    <Root>
      <Alert
        visible={no_load}
        setVisible={set_no_load}
        res={'정보를 불러오는데 실패했습니다. 새로고침을 해주세요.'}
      />
      <LogoHeader
        icon={'bell-outline'}
        size={24}
        onPress={() => {
          stack_navigation.navigate(ScreenNames.Notification);
        }}
      />
      <TouchableRipple
        style={styles.WriteCircle}
        borderless={true}
        onPress={() => {
          if (!network) {
            showNetworkAlert(true);
          } else {
            stack_navigation.navigate(ScreenNames.Writing);
          }
        }}>
        <WriteCircle>
          <MaterialCommunityIcons
            name={'pencil-plus'}
            size={22}
            color={Color.White}
          />
        </WriteCircle>
      </TouchableRipple>
      <FlatList
        data={writingsData}
        renderItem={({item, index}) => (
          <ParkElement
            line={index !== writingsData.length - 1}
            image_uri={item.images[0]}
            address={item.address.address}
            service_time={item.start_time + ' ~ ' + item.end_time}
            reservation={item.reservation}
            last_time={timeForToday(item.upload_time)}
            on_press={() => {
              if (!network) {
                showNetworkAlert(true);
              } else {
                stack_navigation.navigate(ScreenNames.Read, {id: item.id});
              }
            }}
            upload_time={item.upload_time}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              if (!network) {
                showNetworkAlert(true);
              } else {
                setRefreshing(true);
                store.get_writings().then(s => {
                  if (s.status) {
                    if (s.data!.length === 0) {
                      ToastAndroid.show(
                        '주차장이 존재하지 않습니다.',
                        ToastAndroid.SHORT,
                      );
                    }
                    isEnd.current = false;
                    setWritingsData(s.data as Array<store.WritingInfoId>);
                  } else {
                    set_no_load(true);
                  }
                  setRefreshing(false);
                });
              }
            }}
          />
        }
        onScrollEndDrag={e => {
          if (e.nativeEvent.contentOffset.y !== 0) {
            if (isEnd.current || !network) {
              return;
            }
            store
              .get_writings_with_time(
                writingsData[writingsData.length - 1].upload_time,
              )
              .then(s => {
                if (!s.status) {
                  isEnd.current = true;
                } else {
                  setWritingsData([
                    ...writingsData,
                    ...(s.data as Array<store.WritingInfoId>),
                  ]);
                }
              });
          }
        }}
      />
    </Root>
  );
}
