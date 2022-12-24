import React from 'react';
import styles, {
  Box,
  Image,
  Info,
  InfoView,
  MoneyText,
  ScoreBox,
  Text,
} from './styles';
import {ImageSourcePropType} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Color} from '../../../values';
import {TouchableRipple} from 'react-native-paper';

interface Props {
  source: ImageSourcePropType;
  address: string;
  service_time: string;
  score: number;
  onPress: () => any;
}

function getMoney(start: string, end: string): string {
  const hours = Number(end.split(':')[0]) - Number(start.split(':')[0]);
  const minutes = Number(end.split(':')[1]) - Number(start.split(':')[1]);

  return (hours * 3000 + (minutes / 10) * 500)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function (props: Props) {
  return (
    <TouchableRipple
      style={styles.Ripple}
      borderless={true}
      onPress={props.onPress}>
      <Box>
        <Image source={props.source} resizeMode={'cover'} />
        <InfoView>
          <Info>
            <MaterialCommunityIcons
              name={'map-marker-outline'}
              size={17}
              color={Color.Black}
            />
            <Text>{props.address}</Text>
          </Info>
          <Info style={styles.TextMargin}>
            <MaterialCommunityIcons
              name={'clock-time-eight-outline'}
              size={17}
              color={Color.Black}
            />
            <Text>이용 가능 시간{'\n' + props.service_time}</Text>
          </Info>
          <Info style={styles.TextMargin}>
            <MoneyText>
              {getMoney(
                props.service_time.split('~')[0],
                props.service_time.split('~')[1],
              )}{' '}
              KRW
            </MoneyText>
          </Info>
        </InfoView>
        <ScoreBox>{props.score}</ScoreBox>
      </Box>
    </TouchableRipple>
  );
}
