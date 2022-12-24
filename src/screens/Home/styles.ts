import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Color} from '../../values';

export const Root = styled.SafeAreaView`
  flex: 1;
  background-color: ${Color.White};
`;

export const WriteCircle = styled.View`
  display: flex;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${Color.ActiveColor};
  align-items: center;
  justify-content: center;
`;

export default StyleSheet.create({
  WriteCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    right: 15,
    bottom: 15,
    zIndex: 1,
  },
});
