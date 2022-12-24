import React, {useContext, useMemo, useState} from 'react';
import {BottomNavigation} from 'react-native-paper';
import styles, {Label} from './styles';

import {Home, Profile, Chat} from '../../screens';
import {Color} from '../../values';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import {ScreenNames} from '../Stack';
import {GlobalData} from '../../context';

interface Props {
  navigation: StackNavigationHelpers;
}

export default function ({navigation}: Props) {
  const {network, showNetworkAlert} = useContext(GlobalData);

  const [index, setIndex] = useState<number>(0);
  const [routes] = React.useState([
    {key: 'home', title: '홈', icon: 'home-outline'},
    {key: 'map', title: '지도', icon: 'map-outline'},
    {key: 'chat', title: '대화', icon: 'chat-processing'},
    {key: 'profile', title: '내 차량', icon: 'car'},
  ]);
  const renderScene = useMemo(
    () =>
      BottomNavigation.SceneMap({
        home: () => <Home stack_navigation={navigation} />,
        map: () => null,
        chat: () => <Chat stack_navigation={navigation} />,
        profile: () => <Profile stack_navigation={navigation} />,
      }),
    [navigation],
  );

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={i => {
        if (i === 1) {
          if (!network) {
            showNetworkAlert(true);
          } else {
            navigation.navigate(ScreenNames.Map);
          }
        } else {
          setIndex(i);
        }
      }}
      renderScene={renderScene}
      renderLabel={({route, color}) => (
        <Label color={color}>{route.title}</Label>
      )}
      barStyle={styles.barStyle}
      activeColor={Color.ActiveColor}
    />
  );
}
