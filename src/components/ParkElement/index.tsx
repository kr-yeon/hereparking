import React from 'react';
import {TouchableRipple} from 'react-native-paper';
import styles, {
  Image,
  Root,
  InfoView,
  Info,
  Text,
  Reservation,
  ReservationClear,
  BottomText,
} from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Color} from '../../values';

interface ParkElementProps {
  line: boolean;
  reservation: boolean;
  image_uri: string;
  address: string;
  service_time: string;
  last_time: string;
  on_press?: Function;
  upload_time: number;
}

export default function (props: ParkElementProps) {
  return (
    <TouchableRipple
      style={[styles.Ripple, props.line ? styles.RippleLine : null]}
      onPress={() => (props.on_press ?? (() => {}))()}
      borderless={true}>
      <Root>
        <Image
          source={{
            uri: props.image_uri + '&' + props.upload_time,
          }}
          resizeMode={'cover'}
        />
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
        </InfoView>
        {props.reservation ? (
          <ReservationClear>예약 완료</ReservationClear>
        ) : (
          <Reservation>예약 가능</Reservation>
        )}
        <BottomText>{props.last_time}</BottomText>
      </Root>
    </TouchableRipple>
  );
}
