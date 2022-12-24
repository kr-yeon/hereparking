import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';

export const Root = styled.SafeAreaView`
  flex: 1;
  background-color: white;
  align-items: center;
`;

export const MarkerImage = styled.Image`
  width: 30px;
  height: 30px;
`;

export default StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
});
