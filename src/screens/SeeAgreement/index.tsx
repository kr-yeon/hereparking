import React, {useEffect} from 'react';
import {BackGround, Scroll, Text} from './styles';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import {Header} from '../../components';
import {ScreenNames} from '../../navigation/Stack';
import {BackHandler} from 'react-native';

interface Props {
  navigation: StackNavigationHelpers;
  route: any;
}

export default function ({route, navigation}: Props) {
  useEffect(() => {
    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, []);

  return (
    <BackGround>
      <Header
        viewText={route.params.title}
        backPress={() => {
          navigation.goBack();
        }}
      />
      <Scroll>
        <Text>{route.params.text}</Text>
      </Scroll>
    </BackGround>
  );
}
