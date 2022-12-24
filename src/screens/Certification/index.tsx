import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BackHandler, Keyboard, ToastAndroid } from "react-native";
import {Alert, Header, Input, LoadingAlert} from '../../components';
import styles, {
  BackGround,
  HorizonView,
  RequestButton,
  ResText,
} from './styles';
import fbauth from '@react-native-firebase/auth';
import {auth} from '../../firebase/index';
import {ScreenNames} from '../../navigation/Stack';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import {GlobalData} from '../../context';
import {TouchableRipple} from 'react-native-paper';
import {editPhoneNumber} from '../../firebase/store';

interface Props {
  navigation: StackNavigationHelpers;
  route: any;
}

export default function ({navigation, route}: Props) {
  const {uid, network, showNetworkAlert} = useContext(GlobalData);

  const [certificationNumber, setCertificationNumber] = useState<string>('');
  const [phone_number, set_phone_number] = useState<string>('');
  const [check_code, set_check_code] = useState<boolean>(false);
  const [no_certification_code, set_no_certification_code] =
    useState<boolean>(false);
  const [certificateCheckNumber, setCertificateCheckNumber] =
    useState<number>(5);
  const [no_right_number, set_no_right_number] = useState<boolean>(false);
  const [send_code, set_send_code] = useState<boolean>(false);
  const [error, set_error] = useState<boolean>(false);
  const [noConfirmation, setNoConfirmation] = useState<boolean>(false);

  const confirmation = useRef(null);

  useEffect(() => {
    if (phone_number.length === 11) {
      return fbauth().onAuthStateChanged(user => {
        if (user) {
          if (route.params?.edit) {
            editPhoneNumber(uid, phone_number).then(status => {
              if (status) {
                ToastAndroid.show(
                  '전화번호 수정이 완료되었습니다.',
                  ToastAndroid.SHORT,
                );
                navigation.goBack();
              } else {
                set_error(true);
              }
            });
          } else {
            ToastAndroid.show(
              '전화번호 인증이 완료되었습니다.',
              ToastAndroid.SHORT,
            );
            navigation.navigate(ScreenNames.Accession, {
              uid: uid,
              phone_number,
            });
          }
        }
      });
    }
  }, [phone_number]);

  useEffect(() => {
    auth.signOut();

    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, []);

  useEffect(() => {
    if (certificateCheckNumber === 0) {
      navigation.goBack();
    } else if (certificateCheckNumber !== 5) {
      set_no_certification_code(true);
    }
  }, [certificateCheckNumber]);

  return (
    <BackGround>
      <LoadingAlert
        visible={check_code}
        setVisible={set_check_code}
        res={'인증번호를 확인하고 있습니다...'}
      />
      <LoadingAlert
        visible={send_code}
        setVisible={set_send_code}
        res={'인증코드를 보내고 있습니다...'}
      />
      <Alert
        visible={no_right_number}
        setVisible={set_no_right_number}
        res={'제대로된 번호를 입력해주세요.'}
      />
      <Alert
        visible={error}
        setVisible={set_error}
        title={'오류가 발생했습니다.'}
        res={
          '단기간에 많은 인증번호를 요청했을 수 있습니다. 잠시 후 시도해주세요.'
        }
      />
      <Alert
        visible={no_certification_code}
        setVisible={set_no_certification_code}
        res={
          '제대로된 번호를 입력해주세요.\n남은 입력횟수 : ' +
          certificateCheckNumber +
          '회'
        }
      />
      <Alert
        visible={noConfirmation}
        setVisible={setNoConfirmation}
        res={'인증하기 버튼을 눌러주세요.'}
      />
      <Header
        viewText={route.params?.edit ? '전화번호 변경' : '본인인증'}
        nextText={'확인'}
        backPress={() => navigation.goBack()}
        nextPress={() => {
          Keyboard.dismiss();
          if (!confirmation.current) {
            setNoConfirmation(true);
            return;
          }
          if (!network) {
            showNetworkAlert(true);
          } else {
            set_check_code(true);
            auth.confirm(confirmation.current, certificationNumber).then(s => {
              set_check_code(false);
              if (!s.type) {
                setCertificateCheckNumber(certificateCheckNumber - 1);
              }
            });
          }
        }}
      />
      <HorizonView>
        <Input
          placeholder={'전화번호를 입력해주세요'}
          keyboardType={'numeric'}
          value={phone_number}
          onChangeText={t => set_phone_number(t.replace(/[^0-9]/g, ''))}
          maxLength={11}
          style={styles.phoneNumberInput}
        />
        <TouchableRipple
          style={styles.touchable}
          onPress={() => {
            Keyboard.dismiss();
            if (!network) {
              showNetworkAlert(true);
            } else {
              if (
                phone_number.length !== 11 ||
                !phone_number.startsWith('010')
              ) {
                set_no_right_number(true);
              } else {
                setCertificateCheckNumber(5);
                set_send_code(true);
                auth.signInWithPhoneNumber(phone_number).then(s => {
                  set_send_code(false);
                  if (!s.type) {
                    set_error(true);
                  } else {
                    confirmation.current = s.data;
                  }
                });
              }
            }
          }}
          borderless={true}>
          <RequestButton>인증하기</RequestButton>
        </TouchableRipple>
      </HorizonView>
      <Input
        placeholder={'인증번호를 입력해주세요.'}
        keyboardType={'numeric'}
        value={certificationNumber}
        onChangeText={t => setCertificationNumber(t.replace(/[^0-9]/g, ''))}
        maxLength={6}
      />
      <ResText>발송된 인증번호를 입력하시고, 확인을 눌러주세요.</ResText>
    </BackGround>
  );
}
