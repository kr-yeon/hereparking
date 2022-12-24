import React, {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {
  BackGround,
  AgreementResView,
  AgreementResText,
  AgreeCheckView,
  SupportLine,
  AgreementCheckButton,
} from './styles';
import {Alert, Header} from '../../components';
import {Color} from '../../values';
import {ScreenNames} from '../../navigation/Stack';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import agreement from './agreement';

interface Props {
  navigation: StackNavigationHelpers;
  route: any;
}

export default function ({navigation, route}: Props) {
  const [all_check, set_all_check] = useState<boolean>(!!route.params?.check);
  const [check_1, set_check_1] = useState<boolean>(!!route.params?.check);
  const [check_2, set_check_2] = useState<boolean>(!!route.params?.check);
  const [no_all_check, set_no_all_check] = useState<boolean>(false);

  useEffect(() => {
    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, []);

  useEffect(() => {
    if (check_1 && check_2) {
      set_all_check(true);
    } else {
      set_all_check(false);
    }
  }, [check_1, check_2]);

  return (
    <BackGround>
      <Alert
        visible={no_all_check}
        setVisible={set_no_all_check}
        res={'모든 약관에 동의해주세요.'}
      />
      <Header
        viewText={route.params?.check ? '약관 확인' : '약관 동의'}
        nextText={route.params?.check ? '확인' : '다음'}
        backPress={() => {
          if (route.params?.check) {
            navigation.goBack();
          } else {
            navigation.reset({routes: [{name: ScreenNames.Login}]});
          }
        }}
        nextPress={() => {
          if (!all_check) {
            set_no_all_check(true);
          } else {
            if (route.params?.check) {
              navigation.goBack();
            } else {
              navigation.navigate(ScreenNames.Certification, {...route.params});
            }
          }
        }}
      />
      <AgreeCheckView>
        <AgreementCheckButton
          text={'모든 약관 동의'}
          isCheck={all_check}
          onPress={() => {
            const all_check_v = !all_check;
            set_all_check(all_check_v);
            if (all_check_v) {
              set_check_1(true);
              set_check_2(true);
            } else {
              set_check_1(false);
              set_check_2(false);
            }
          }}
          disable={!!route.params?.check}
        />
        <SupportLine />
        <AgreementCheckButton
          text={'[필수] 개인정보 처리방침 동의'}
          isCheck={check_1}
          onPress={() => set_check_1(!check_1)}
          disable={!!route.params?.check}
          res={'보기'}
          onResPress={async () => {
            navigation.navigate(ScreenNames.SeeAgreement, {
              navigation,
              title: '[필수] 개인정보 처리방침 동의',
              text: agreement.privacy_policy,
            });
          }}
        />
        <SupportLine />
        <AgreementCheckButton
          text={'[필수] 위치기반서비스이용약관'}
          isCheck={check_2}
          onPress={() => set_check_2(!check_2)}
          disable={!!route.params?.check}
          res={'보기'}
          onResPress={async () => {
            navigation.navigate(ScreenNames.SeeAgreement, {
              navigation,
              title: '[필수] 위치기반서비스이용약관',
              text: agreement.location_service,
            });
          }}
        />
      </AgreeCheckView>
      <AgreementResView>
        <AgreementResText color={Color.Red}>* </AgreementResText>
        <AgreementResText>
          동의 후에는, 해당 서비스의 이용약관 및 개인정보처리방침에 따라
          관리됩니다.
        </AgreementResText>
      </AgreementResView>
    </BackGround>
  );
}
