import React, {useEffect, useRef, useState} from 'react';
import 'react-native-gesture-handler';
import {
  Text,
  TextInput,
  LogBox,
  BackHandler,
  ToastAndroid,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {StatusBar} from 'react-native';
import {Color, StorageKey} from './src/values';
import {Stack} from './src/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import {GlobalData} from './src/context';
import {Alert} from './src/components';
import PushNotification from 'react-native-push-notification';
import {NotificationChannels} from './src/api/sendNotification';
import messaging from '@react-native-firebase/messaging';

let exitApp: boolean = false;

// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
  '`new NativeEventEmitter()`',
  "Can't perform a React state up",
]);

const styles = StyleSheet.create({
  ImageBackground: {
    flex: 1,
  },
});

function handleBackButton() {
  let timeout: ReturnType<typeof setTimeout>;

  if (!exitApp) {
    ToastAndroid.show('한번 더 뒤로가면 앱이 종료됩니다.', ToastAndroid.SHORT);
    exitApp = true;
    timeout = setTimeout(() => {
      exitApp = false;
    }, 2000);
  } else {
    // @ts-ignore
    clearTimeout(timeout);
    BackHandler.exitApp();
  }

  return true;
}

const App = () => {
  const [load, set_load] = useState<boolean>(true);
  const [is_login, set_is_login] = useState<boolean>(false);
  const [uid, setUid] = useState<string>('');
  const [network, setNetwork] = useState<boolean>(true);
  const [networkAlert, showNetworkAlert] = useState<boolean>(false);

  const chatScreen = useRef<string>('');

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    PushNotification.createChannel(
      {
        channelId: NotificationChannels.createChat,
        channelName: '채팅방 생성',
      },
      () => {},
    );
    PushNotification.createChannel(
      {
        channelId: NotificationChannels.chat,
        channelName: '채팅',
      },
      () => {},
    );
    messaging().onMessage(s => {
      if (s.data?.roomId !== chatScreen.current) {
        PushNotification.localNotification({
          channelId:
            s.notification?.android?.channelId ?? NotificationChannels.chat,
          title: s.notification?.title ?? '',
          message: s.notification?.body ?? '',
        });
      }
    });

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    AsyncStorage.getItem(StorageKey.uid).then(storageUid => {
      set_is_login(!!storageUid);
      if (storageUid) {
        setUid(storageUid);
      }
      set_load(false);
    });

    NetInfo.addEventListener(state => {
      setNetwork(state.isConnected as boolean);
    });

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, []);

  return (
    <PaperProvider theme={{...DefaultTheme, dark: false}}>
      <GlobalData.Provider
        value={{
          uid,
          setUid,
          network,
          showNetworkAlert,
          setChatScreen: (v: string) => {
            chatScreen.current = v;
          },
        }}>
        <Alert
          res={'네트워크 연결이 불안정합니다.'}
          visible={networkAlert}
          setVisible={showNetworkAlert}
        />
        <StatusBar backgroundColor={Color.ActiveColor} />
        {load ? (
          <ImageBackground
            source={require('./src/assets/images/splash_screen.png')}
            style={styles.ImageBackground}
          />
        ) : (
          <Stack is_login={is_login} />
        )}
      </GlobalData.Provider>
    </PaperProvider>
  );
};

export default App;
