import React, {useState, useContext, useCallback, useEffect} from 'react';
import {LogoHeader, ParkElement} from '../../components';
import styles, {
  Root,
  Scroll,
  ImageCircle,
  CircleView,
  Line,
  UserInfoView,
  UserName,
  UserScore,
  HorizonView,
  ButtonText,
  GuideText,
  SettingView,
  UserInfo,
  CarInfo,
} from './styles';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableRipple} from 'react-native-paper';
import {Color} from '../../values';
import {GlobalData} from '../../context';
import {store} from '../../firebase';
import {
  DeviceEventEmitter,
  RefreshControl,
  ToastAndroid,
  Linking,
} from 'react-native';
import {ScreenNames} from '../../navigation/Stack';

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
  const {network, showNetworkAlert, uid} = useContext(GlobalData);

  const [info, setInfo] = useState<store.UserInfo>({
    nick_name: '',
    phone_number: '',
    writing_list: [],
    car_number: '',
    car_name: '',
    profile_image: '',
    notification: true,
    rank_point: '-',
    notification_list: [],
    token_list: [],
    chat_list: [],
  });
  const [listData, setListData] = useState<Array<store.WritingInfoId>>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const setList = useCallback(
    async list => {
      const data: Array<store.WritingInfoId> = [];
      for (const ele of list) {
        const w = await store.get_writing(ele);

        if (w.status) {
          data.push({id: ele, ...(w.data as store.WritingInfo)});
        }
      }

      setListData(data);
    },
    [setListData],
  );

  const getInfo = useCallback(() => {
    store.get_user(uid).then(s => {
      if (!s.status) {
        ToastAndroid.show(
          '정보를 불러오지 못했습니다. 다시 시도해주십시오.',
          ToastAndroid.SHORT,
        );
      } else {
        setInfo({
          ...(s.data as store.UserInfo),
          profile_image: s.data?.profile_image
            ? s.data?.profile_image + '&' + Date.now()
            : '',
        });
        setList(s.data?.writing_list);
      }
    });
  }, [uid, setList]);

  useEffect(() => {
    if (!network) {
      showNetworkAlert(true);
    } else {
      getInfo();
    }

    DeviceEventEmitter.addListener('refresh_user', _ => {
      getInfo();
    });

    return () => DeviceEventEmitter.removeAllListeners('refresh_user');
  }, []);

  return (
    <Root>
      <LogoHeader />
      {info ? (
        <Scroll
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                if (!network) {
                  showNetworkAlert(true);
                } else {
                  getInfo();
                  setRefreshing(false);
                }
              }}
            />
          }>
          <UserInfoView>
            <HorizonView>
              {info.profile_image ? (
                <ImageCircle
                  source={{uri: info.profile_image}}
                  resizeMode={'cover'}
                />
              ) : (
                <CircleView />
              )}
              <UserInfo>
                <HorizonView>
                  <UserName>{info.nick_name}</UserName>
                  <UserScore>평점 {info.rank_point}</UserScore>
                </HorizonView>
                <CarInfo>{info.car_name}</CarInfo>
                <CarInfo>{info.car_number}</CarInfo>
              </UserInfo>
            </HorizonView>
            <Line />
            <TouchableRipple
              onPress={() => {
                stack_navigation.navigate(ScreenNames.Accession, {
                  edit: true,
                  uid,
                  nick_name: info.nick_name,
                  car_number: info.car_number,
                  car_name: info.car_name,
                  profile_image: info.profile_image,
                });
              }}
              borderless={true}
              style={styles.underTouchRipple}>
              <HorizonView>
                <ButtonText>정보 수정</ButtonText>
                <MaterialCommunityIcons
                  name={'chevron-right'}
                  size={23}
                  color={Color.CircleView}
                  style={styles.buttonArrow}
                />
              </HorizonView>
            </TouchableRipple>
          </UserInfoView>
          <SettingView>
            <TouchableRipple
              onPress={() => {
                Linking.openURL('http://pf.kakao.com/_gHzxib/chat');
              }}
              borderless={true}
              style={styles.topTouchRipple}>
              <HorizonView>
                <ButtonText>고객센터</ButtonText>
                <MaterialCommunityIcons
                  name={'chevron-right'}
                  size={23}
                  color={Color.CircleView}
                  style={styles.buttonArrow}
                />
              </HorizonView>
            </TouchableRipple>
            <Line />
            <TouchableRipple
              onPress={() => {
                stack_navigation.navigate(ScreenNames.Setting);
              }}
              borderless={true}
              style={styles.underTouchRipple}>
              <HorizonView>
                <ButtonText>환경설정</ButtonText>
                <MaterialCommunityIcons
                  name={'chevron-right'}
                  size={23}
                  color={Color.CircleView}
                  style={styles.buttonArrow}
                />
              </HorizonView>
            </TouchableRipple>
          </SettingView>
          <GuideText style={styles.textMargin}>내가 쓴 게시글</GuideText>
          <Line />
          {listData.map((item, index) => (
            <ParkElement
              line={index !== listData.length - 1}
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
              key={index}
              upload_time={item.upload_time}
            />
          ))}
        </Scroll>
      ) : null}
    </Root>
  );
}
