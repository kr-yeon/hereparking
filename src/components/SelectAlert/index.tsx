import React from 'react';
import {Portal, Dialog, Paragraph, Button} from 'react-native-paper';
import {Color} from '../../values';
import styles from './styles';

export interface AlertProps {
  visible: boolean;
  setVisible: Function;
  title?: string;
  res: string;
  onSuccess?: Function;
}

export default function (props: AlertProps) {
  return (
    <Portal>
      <Dialog
        visible={props.visible}
        dismissable={true}
        onDismiss={() => props.setVisible(false)}>
        {props.title ? (
          <Dialog.Title style={styles.title}>{props.title}</Dialog.Title>
        ) : null}
        <Dialog.Content>
          <Paragraph style={styles.res}>{props.res}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            color={Color.ActiveColor}
            onPress={() => props.setVisible(false)}
            labelStyle={styles.res}>
            취소
          </Button>
          <Button
            color={Color.ActiveColor}
            onPress={() => (props.onSuccess ?? (() => {}))()}
            labelStyle={styles.res}>
            확인
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

