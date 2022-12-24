import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {getBottomSpace} from 'react-native-iphone-x-helper';

export const BottomMargin = styled.View`
  height: ${getBottomSpace() + 10}px;
`;

export default StyleSheet.create({
  modal: {
    display: 'flex',
    alignItems: 'center',
  },
  modalChild: {
    height: 135,
    marginTop: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  confirmButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
