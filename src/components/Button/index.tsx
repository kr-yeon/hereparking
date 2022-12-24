import {Color} from '../../values';
import {Button} from 'react-native-paper';
import React from 'react';
import styles from './styles';
import {ViewStyle} from 'react-native';

export interface ButtonProps {
  text: string;
  onPress?: Function;
  style?: ViewStyle;
}

export default function (props: ButtonProps) {
  return (
    <Button
      mode="contained"
      compact={true}
      dark={false}
      onPress={() => (props.onPress ?? (() => {}))()}
      style={[styles.button, props.style ?? {}]}
      contentStyle={styles.button_content}
      labelStyle={styles.button_label}
      color={Color.ActiveColor}>
      {props.text}
    </Button>
  );
}
