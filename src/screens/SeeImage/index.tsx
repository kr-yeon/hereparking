import React, {useEffect, useState} from 'react';
import {BackHandler, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import styles, {Image} from './styles';
import {Color} from '../../values';
import {IconButton} from 'react-native-paper';
import {Dot, DotView} from '../Read/styles';

interface Props {
  navigation: StackNavigationHelpers;
  route: any;
}

export default function ({navigation, route}: Props) {
  const [enableScroll, setEnableScroll] = useState<boolean>(true);
  const [select, setSelect] = useState<number>(route.params.select);

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
    <>
      <IconButton
        icon={'chevron-left'}
        color={Color.White}
        size={33}
        borderless={true}
        style={styles.backIcon}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <PagerView
        style={styles.paperView}
        scrollEnabled={enableScroll}
        onPageScroll={e => setSelect(e.nativeEvent.position)}
        initialPage={select}>
        {route.params.images.map((s: string, i: number) => (
          <View key={'v' + i}>
            <ReactNativeZoomableView
              maxZoom={1.5}
              minZoom={1}
              initialZoom={1}
              bindToBorders={true}
              // @ts-ignore
              onZoomEnd={(_, __, z) => {
                setEnableScroll(z.zoomLevel === 1);
              }}
              // @ts-ignore
              onDoubleTapAfter={(_, __, z) => {
                setEnableScroll(z.zoomLevel === 1);
              }}>
              <Image
                source={{
                  uri: s,
                }}
                resizeMode="contain"
              />
            </ReactNativeZoomableView>
          </View>
        ))}
      </PagerView>
      <DotView>
        {route.params.images.map((_: string, i: number) => (
          <Dot
            size={i === select ? 11 : 9}
            color={i === select ? Color.ActiveColor : Color.White}
            key={i}
          />
        ))}
      </DotView>
    </>
  );
}
