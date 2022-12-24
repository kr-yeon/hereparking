import React, {useContext} from 'react';
import styles, {BackGround, LoginBox} from './styles';
import {Image} from 'react-native';
import {StorageKey} from '../../values';
import {store} from '../../firebase';
import {ScreenNames} from '../../navigation/Stack';
import {GlobalData} from '../../context';
import {TouchableRipple} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as KakaoLogins from '@react-native-seoul/kakao-login';

interface Props {
  navigation: any;
}

export default function ({navigation}: Props) {
  const {setUid} = useContext(GlobalData);

  return (
    <BackGround>
      <Image
        source={require('../../assets/images/logo.png')}
        resizeMode={'contain'}
        style={styles.logo}
      />
      <TouchableRipple
        style={styles.loginRipple}
        borderless={true}
        onPress={async () => {
          try {
            await KakaoLogins.login();
            const uid = (await KakaoLogins.getProfile()).id;

            store
              .duplicate_check((await KakaoLogins.getProfile()).id)
              .then(exit => {
                setUid(uid);
                if (!exit) {
                  navigation.navigate(ScreenNames.Agreement, {
                    uid: uid,
                  });
                } else {
                  AsyncStorage.setItem(StorageKey.uid, uid).then(_ => {
                    navigation.reset({routes: [{name: ScreenNames.Home}]});
                  });
                }
                KakaoLogins.logout();
              });
          } catch (_) {}
        }}>
        <LoginBox>카카오톡으로 로그인하기</LoginBox>
      </TouchableRipple>
    </BackGround>
  );
}
