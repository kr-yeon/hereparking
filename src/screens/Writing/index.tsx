import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import styles, {
  Root,
  Scroll,
  Text,
  Line,
  ResText,
  PhotoBox,
  PhotoZone,
  MarginView,
  PhotoImage,
  SelectTimeText,
  SetTimeView,
  MarkerImage,
} from './styles';
import {
  BackHandler,
  PermissionsAndroid,
  ToastAndroid,
  DeviceEventEmitter,
} from 'react-native';
import {Header, Alert, Input, Button, LoadingAlert} from '../../components';
import {TouchableRipple} from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {Color} from '../../values';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import {Modalize} from 'react-native-modalize';
import TimeModal from './TimeModal';
import {geocoding} from '../../api';
import {storage, store} from '../../firebase';
import {GlobalData} from '../../context';

interface Props {
  navigation: StackNavigationHelpers;
  route: any;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

let clickable: boolean = false;

export default function ({navigation, route}: Props) {
  const {uid, network, showNetworkAlert} = useContext(GlobalData);

  const nowDate = useRef<Date>(new Date());
  const startDateRef = useRef<Modalize>(null);
  const endDateRef = useRef<Modalize>(null);

  const [load, setLoad] = useState<boolean>(false);
  const [location, setLocation] = useState<ILocation>({
    latitude: 35.87222,
    longitude: 128.6025,
  }); // 대구 좌표
  const [markerPosition, setMarkerPosition] = useState<ILocation>({
    latitude: 35.87222,
    longitude: 128.6025,
  });
  const [images, setImages] = useState<Array<string>>(
    route.params?.images ? route.params.images : [],
  );
  const [startDate, setStartDate] = useState<Date>(
    new Date(
      nowDate.current.getFullYear(),
      nowDate.current.getMonth() + 1,
      nowDate.current.getDate(),
      route.params?.start_time
        ? Number(route.params.start_time.split(':')[0])
        : nowDate.current.getHours(),
      route.params?.start_time
        ? Number(route.params.start_time.split(':')[1])
        : Number(
            Number(
              Number(
                nowDate.current.getMinutes() >= 10
                  ? String(nowDate.current.getMinutes())[0]
                  : 0,
              ) +
                1 +
                '0',
            ),
          ),
    ),
  );
  const [startDateText, setStartDateText] = useState<string>('시작 시간');
  const [endDate, setEndDate] = useState<Date>(
    new Date(
      nowDate.current.getFullYear(),
      nowDate.current.getMonth() + 1,
      nowDate.current.getDate(),
      route.params?.end_time
        ? Number(route.params.end_time.split(':')[0])
        : nowDate.current.getHours(),
      route.params?.end_time
        ? Number(route.params.end_time.split(':')[1])
        : Number(
            Number(
              nowDate.current.getMinutes() >= 10
                ? String(nowDate.current.getMinutes())[0]
                : 0,
            ) +
              2 +
              '0',
          ),
    ),
  );
  const [endDateText, setEndDateText] = useState<string>('종료 시간');
  const [maxImage, setMaxImage] = useState<boolean>(false);
  const [zeroImage, setZeroImage] = useState<boolean>(false);
  const [image_upload, set_image_upload] = useState<boolean>(false);
  const [save_data, set_save_data] = useState<boolean>(false);
  const [upload_error, set_upload_error] = useState<boolean>(false);
  const [no_address_alert, set_no_address_alert] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(
    route.params?.address ? route.params.address.address : '',
  );
  const [detailAddress, setDetailAddress] = useState<string>(
    route.params?.address ? route.params.address.detail_address : '',
  );
  const [nDate, setNDate] = useState<number>(Date.now());

  const formatTime = useCallback((time: number): string => {
    if (time.toString().length === 1) {
      return '0' + time;
    } else {
      return time.toString();
    }
  }, []);
  const onImageLibraryPress = useCallback(() => {
    if (clickable) {
      return;
    }
    clickable = true;
    if (images.length === 5) {
      setMaxImage(true);
      return;
    }
    const options = {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
    };
    // @ts-ignore
    ImagePicker.launchImageLibrary(options, data => {
      if (data?.assets) {
        setImages(
          [...images, ...data.assets.map(s => s.uri as string)].slice(0, 5),
        );
      }
    });
    setTimeout(() => {
      clickable = false;
    }, 3000);
  }, [images]);

  useEffect(() => {
    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (route.params?.location) {
      setLocation(route.params.location);
      setMarkerPosition(route.params.location);
      setLoad(true);
    } else {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({
            latitude,
            longitude,
          });
          setMarkerPosition({
            latitude,
            longitude,
          });
          geocoding(latitude, longitude).then(s => {
            if (!s.status) {
              setAddress('주소를 불러올 수 없습니다.');
            } else {
              setAddress(s.address as string);
            }
          });
          setLoad(true);
        },
        _ => {
          ToastAndroid.show(
            '위치 정보 이용을 동의해주세요.',
            ToastAndroid.SHORT,
          );
          setLoad(true);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      DeviceEventEmitter.emit('refresh_writings');
    };
  }, []);

  useMemo(() => {
    setStartDateText(
      formatTime(startDate.getHours()) +
        ':' +
        formatTime(startDate.getMinutes()),
    );
    if (
      startDate.getHours() >= endDate.getHours() &&
      startDate.getMinutes() >= endDate.getMinutes()
    ) {
      setEndDate(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          Number(
            Number(
              startDate.getMinutes() >= 10
                ? String(startDate.getMinutes())[0]
                : 0,
            ) +
              1 +
              '0',
          ),
        ),
      );
    }
  }, [startDate]);

  useMemo(() => {
    setEndDateText(
      formatTime(endDate.getHours()) + ':' + formatTime(endDate.getMinutes()),
    );
  }, [endDate]);

  return load ? (
    <Root>
      <Header viewText={'게시글 작성'} backPress={() => navigation.goBack()} />
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
        visible={maxImage}
        setVisible={setMaxImage}
        res={
          '이미지 5개가 선택되어 있습니다. 이미지를 삭제한 후 다시 선택해주시길 바랍니다.'
        }
      />
      <Alert
        visible={zeroImage}
        setVisible={setZeroImage}
        res={
          '이미지가 없습니다. 이미지를 넣어주세요.\n(이미지 선택시, 길게 누르면 여러개 선택이 가능합니다.)'
        }
      />
      <Alert
        visible={upload_error}
        setVisible={set_upload_error}
        res={
          '게시글 등록중 에러가 발생했습니다. 다시 시도해주시길 부탁드립니다.'
        }
      />
      <Alert
        visible={no_address_alert}
        setVisible={set_no_address_alert}
        res={'지도에서 주소를 선택하고 다시 시도해주시길 부탁드립니다.'}
      />
      <TimeModal
        ref={startDateRef}
        date={startDate}
        setDate={setStartDate}
        current={startDateRef.current}
      />
      <TimeModal
        ref={endDateRef}
        date={endDate}
        setDate={setEndDate}
        minimumDate={
          new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate(),
            startDate.getHours(),
            Number(Number(String(startDate.getMinutes())[0]) + 1 + '0'),
          )
        }
        current={endDateRef.current}
      />
      <Scroll>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userInterfaceStyle={'light'}
          onPress={e => {
            const coordinate = e.nativeEvent.coordinate;
            setMarkerPosition(coordinate);
            setAddress('로딩중...');
            geocoding(coordinate.latitude, coordinate.longitude).then(s => {
              if (!s.status) {
                setAddress('주소를 불러올 수 없습니다.');
              } else {
                setAddress(s.address as string);
              }
            });
          }}>
          <Marker coordinate={markerPosition}>
            <MarkerImage
              resizeMode={'center'}
              source={require('../../assets/images/marker.png')}
            />
          </Marker>
        </MapView>
        <Text>{address}</Text>
        <Line />
        <Input
          multiline={true}
          style={styles.input}
          placeholder={
            '상세 주소를 입력해주세요.\nex) CU앞에서 좌회전 한 뒤에 첫 번째 교차로에서\n우회전 해주세요.'
          }
          textAlignVertical={'top'}
          value={detailAddress}
          onChangeText={setDetailAddress}
          maxLength={300}
        />
        <ResText style={styles.topMargin}>주차장 사진을 선택해주세요.</ResText>
        <PhotoZone horizontal={true} showsHorizontalScrollIndicator={false}>
          <MarginView />
          <TouchableRipple
            onPress={onImageLibraryPress}
            borderless={true}
            style={styles.rippleView}>
            <PhotoBox>
              <MaterialCommunityIcons
                name={'camera-plus'}
                size={26}
                color={Color.Res}
              />
            </PhotoBox>
          </TouchableRipple>
          {images.map((s, i) => {
            return (
              <TouchableRipple
                onPress={() => setImages(images.filter((e, l) => l !== i))}
                onLongPress={() => {
                  ToastAndroid.show(
                    '대표이미지가 변경되었습니다.',
                    ToastAndroid.SHORT,
                  );
                  setImages([images[i], ...images.filter((e, l) => l !== i)]);
                }}
                borderless={true}
                style={styles.rippleView}
                key={i}>
                <PhotoImage
                  source={{
                    uri: s.startsWith('https://') ? s + '&' + nDate : s,
                  }}
                  resizeMode={'cover'}
                />
              </TouchableRipple>
            );
          })}
          <MarginView />
        </PhotoZone>
        <SelectTimeText style={styles.topMargin}>시간 선택</SelectTimeText>
        <ResText>시작 시간을 입력해주세요. (10분당 500원 자동계산)</ResText>
        <TouchableRipple
          style={styles.timeRippleView}
          borderless={true}
          onPress={() => startDateRef.current?.open()}>
          <SetTimeView>{startDateText}</SetTimeView>
        </TouchableRipple>
        <ResText>종료 시간을 입력해주세요.</ResText>
        <TouchableRipple
          style={styles.timeRippleView}
          borderless={true}
          onPress={() => endDateRef.current?.open()}>
          <SetTimeView>{endDateText}</SetTimeView>
        </TouchableRipple>
        <Button
          text={route.params?.id ? '수정완료' : '등록완료'}
          style={styles.finishButton}
          onPress={() => {
            if (images.length === 0) {
              setZeroImage(true);
            } else {
              if (!network) {
                showNetworkAlert(true);
                return;
              }
              if (
                address === '주소를 불러올 수 없습니다.' ||
                address === '' ||
                address === '로딩중...'
              ) {
                set_no_address_alert(true);
                return;
              }
              set_save_data(true);
              if (route.params?.id) {
                store
                  .edit(
                    route.params.id,
                    uid,
                    markerPosition,
                    address,
                    detailAddress,
                    images.length,
                    startDateText,
                    endDateText,
                  )
                  .then(s => {
                    set_save_data(false);
                    if (s.status) {
                      set_image_upload(true);
                      storage
                        .uploadMultiImage(s.doc_id as string, images)
                        .then(e => {
                          set_image_upload(false);
                          if (e) {
                            ToastAndroid.show(
                              '게시글이 수정되었습니다.',
                              ToastAndroid.SHORT,
                            );
                            DeviceEventEmitter.emit('refresh_read');
                            navigation.goBack();
                          } else {
                            set_upload_error(true);
                          }
                        });
                    } else {
                      set_upload_error(true);
                    }
                  });
              } else {
                store
                  .writing(
                    uid,
                    markerPosition,
                    address,
                    detailAddress,
                    images.length,
                    startDateText,
                    endDateText,
                  )
                  .then(s => {
                    set_save_data(false);
                    if (s.status) {
                      set_image_upload(true);
                      storage
                        .uploadMultiImage(s.doc_id as string, images)
                        .then(e => {
                          set_image_upload(false);
                          if (e) {
                            ToastAndroid.show(
                              '게시글이 등록되었습니다.',
                              ToastAndroid.SHORT,
                            );
                            navigation.goBack();
                          } else {
                            set_upload_error(true);
                          }
                        });
                    } else {
                      set_upload_error(true);
                    }
                  });
              }
            }
          }}
        />
      </Scroll>
    </Root>
  ) : null;
}
