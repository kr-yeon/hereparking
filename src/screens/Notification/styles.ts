import styled from 'styled-components/native';
import {Color} from '../../values';
import {StyleSheet} from 'react-native';

export const Root = styled.SafeAreaView`
  flex: 1;
  background-color: white;
  align-items: center;
`;

export const Line = styled.View`
  width: 90%;
  height: 1px;
  background-color: ${Color.LineColor};
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
`;

export default StyleSheet.create({
  widthFull: {
    width: '100%',
    flex: 1,
  },
});
