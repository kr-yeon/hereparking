import {Dialog, Paragraph, Portal} from 'react-native-paper';
import styles from './styles';
import * as Progress from 'react-native-progress';
import {Color} from '../../values';
import React from 'react';

export interface AlertProps {
  visible: boolean;
  setVisible: Function;
  title?: string;
  res: string;
}

export default function (props: AlertProps) {
  return (
    <Portal>
      <Dialog visible={props.visible} dismissable={false}>
        {props.title ? (
          <Dialog.Title style={styles.title}>{props.title}</Dialog.Title>
        ) : null}
        <Dialog.Content style={styles.load_content}>
          <Progress.Circle
            color={Color.ActiveColor}
            size={30}
            indeterminate={true}
          />
          <Paragraph style={styles.load_res}>{props.res}</Paragraph>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
