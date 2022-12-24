import React from 'react';
import {Text} from 'react-native';
import styles, {Header} from './styles';
import {IconButton, Button} from 'react-native-paper';
import {Color} from '../../values';

export interface HeaderProps {
  viewText: string;
  nextText?: string;
  icon?: string;
  size?: number;
  backPress?: Function;
  nextPress?: Function;
}

export default function (props: HeaderProps) {
  return (
    <>
      <Header>
        <IconButton
          icon={'chevron-left'}
          color={Color.Black}
          style={styles.icon}
          size={33}
          onPress={() => (props.backPress ?? (() => {}))()}
        />
        <Text style={styles.view_text}>{props.viewText}</Text>
        {props.nextText ? (
          <Button
            color={Color.Black}
            dark={false}
            mode={'text'}
            onPress={() => (props.nextPress ?? (() => {}))()}
            style={styles.button}
            labelStyle={styles.button_label}>
            {props.nextText}
          </Button>
        ) : null}
        {props.icon ? (
          <IconButton
            icon={props.icon}
            size={props.size ?? 22}
            color={Color.Black}
            style={styles.button}
            onPress={() => (props.nextPress ?? (() => {}))()}
          />
        ) : null}
      </Header>
    </>
  );
}
