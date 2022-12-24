import React, {useCallback, useContext, useEffect, useState} from 'react';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import styles, {Root, Line} from './styles';
import {Header} from '../../components';
import {getNotification, INotificationList} from '../../firebase/store';
import {GlobalData} from '../../context';
import {
  ToastAndroid,
  FlatList,
  BackHandler,
  RefreshControl,
} from 'react-native';
import Notification from './Notification';

interface Props {
  navigation: StackNavigationHelpers;
}

export default function ({navigation}: Props) {
  const {uid, network, showNetworkAlert} = useContext(GlobalData);
  const [load, setLoad] = useState(false);
  const [notis, setNotis] = useState<Array<INotificationList>>([]);
  const [refreshing, setRefreshing] = useState(false);

  const initInfo = useCallback(() => {
    if (!network) {
      showNetworkAlert(true);
      navigation.goBack();
    } else {
      getNotification(uid).then(data => {
        if (typeof data === 'boolean') {
          ToastAndroid.show('정보를 불러오지 못했습니다.', ToastAndroid.SHORT);
          if (!notis) {
            navigation.goBack();
          }
        } else {
          if (data.length === 0) {
            ToastAndroid.show(
              '전송된 알림이 존재하지 않습니다.',
              ToastAndroid.SHORT,
            );
          }
          setNotis(data as unknown as Array<INotificationList>);
          setLoad(true);
          setRefreshing(false);
        }
      });
    }
  }, [network, showNetworkAlert]);

  useEffect(() => {
    setLoad(false);
    initInfo();

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
      <Header viewText={'알림'} backPress={navigation.goBack} />
      {load ? (
        <FlatList
          data={notis.reverse()}
          renderItem={item => (
            <>
              <Notification
                title={item.item.title}
                time={item.item.time}
                res={item.item.res}
                key={item.index}
              />
              {notis.length - 1 === item.index ? null : <Line />}
            </>
          )}
          style={styles.widthFull}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                if (!network) {
                  showNetworkAlert(true);
                } else {
                  initInfo();
                  setRefreshing(false);
                }
              }}
            />
          }
        />
      ) : null}
    </Root>
  );
}
