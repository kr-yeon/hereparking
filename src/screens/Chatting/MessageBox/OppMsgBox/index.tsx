import React from 'react';
import {View, Text, Time} from './styles';

interface Props {
  time: string;
  msg: string;
  style?: any;
}

export default function ({time, msg, style}: Props) {
  return (
    <View style={style ?? {}}>
      <Text>{msg}</Text>
      <Time>{time}</Time>
    </View>
  );
}
