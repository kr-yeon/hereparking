import React from 'react';
import styles, {Header, LogoImage} from './styles';
import {Color} from '../../values';
import {IconButton} from 'react-native-paper';

interface Props {
  icon?: string;
  size?: number;
  onPress?: () => void;
}

export default function (props: Props) {
  return (
    <>
      <Header>
        <LogoImage
          source={require('../../assets/images/header_logo.png')}
          resizeMode={'contain'}
        />
        {props.icon ? (
          <IconButton
            icon={props.icon}
            size={props.size ?? 22}
            color={Color.Black}
            style={styles.icon}
            onPress={() => (props.onPress ?? (() => {}))()}
          />
        ) : null}
      </Header>
    </>
  );
}
