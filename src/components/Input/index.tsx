import React from 'react';
import {TextInputProps} from 'react-native';
import Input from './styles';
import {Color} from '../../values';

export default function (props: TextInputProps) {
  // @ts-ignore
  return <Input {...props} placeholderTextColor={Color.PlaceholderTextColor} />;
}
