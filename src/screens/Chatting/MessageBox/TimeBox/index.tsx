import React from 'react';
import {Text} from './styles';

export default function (props: {msg: string}) {
  return <Text>{props.msg}</Text>;
}
