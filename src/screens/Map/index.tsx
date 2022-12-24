import React, { useCallback, useContext, useEffect, useState } from "react";
import styles, {Root, MarkerImage} from './styles';
import {Header} from '../../components';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {BackHandler, PermissionsAndroid, ToastAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {get_map_info, WritingInfoId} from '../../firebase/store';
import SelectBox from './SelectBox';
import {ScreenNames} from '../../navigation/Stack';
import {GlobalData} from '../../context';

interface ILocation {
  latitude: number;
  longitude: number;
}

interface Props {
  navigation: StackNavigationHelpers;
}

export default function ({navigation}: Props) {
  const {network, showNetworkAlert} = useContext(GlobalData);
  const [location, setLocation] = useState<ILocation>({
    latitude: 35.87222,
    longitude: 128.6025,
  });
  const [load, setLoad] = useState<boolean>(false);
  const [markerData, setMarkerData] = useState<Array<WritingInfoId>>([]);
  const [selectData, setSelectData] = useState<undefined | WritingInfoId>(
    undefined,
  );
  const initData = useCallback(() => {
    if (!network) {
      showNetworkAlert(true);
      return;
    }
    setLoad(false);
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    function initMarkerData() {
      get_map_info().then(s => {
        if (typeof s === 'boolean') {
          ToastAndroid.show(
            '정보를 불러오는 도중 오류가 발생했습니다.\n다시 시도해주세요.',
            ToastAndroid.SHORT,
          );
        } else {
          setMarkerData(s);
        }
      });
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
        });
        initMarkerData();
        setLoad(true);
      },
      _ => {
        ToastAndroid.show('위치 정보 이용을 동의해주세요.', ToastAndroid.SHORT);
        initMarkerData();
        setLoad(true);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [network]);

  useEffect(() => {
    initData();

    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <Root>
      <Header
        viewText={'지도'}
        backPress={navigation.goBack}
        icon={'refresh'}
        nextPress={() => {
          initData();
        }}
      />
      {selectData ? (
        <SelectBox
          source={{uri: selectData.images[0] + '&' + selectData.upload_time}}
          address={selectData.address.address}
          service_time={selectData.start_time + '~' + selectData.end_time}
          score={6.5}
          onPress={() =>
            navigation.navigate(ScreenNames.Read, {id: selectData.id})
          }
        />
      ) : null}
      {load ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            ...location,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userInterfaceStyle={'light'}
          onPress={() => setSelectData(undefined)}>
          {markerData.map(s =>
            s.reservation ? null : (
              <Marker
                coordinate={{
                  ...s.location,
                }}
                onPress={() => {
                  setSelectData(s);
                }}
                key={s.id}>
                <MarkerImage
                  resizeMode={'center'}
                  source={require('../../assets/images/marker.png')}
                />
              </Marker>
            ),
          )}
        </MapView>
      ) : null}
    </Root>
  );
}
