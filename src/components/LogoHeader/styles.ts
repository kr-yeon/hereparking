import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Color} from '../../values';

export const Header = styled.View`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  border-bottom-color: ${Color.LineColor};
  border-bottom-width: 1px;
  align-items: center;
`;

export const LogoImage = styled.Image`
  width: 90px;
  margin-left: 15px;
`;

export default StyleSheet.create({
  icon: {
    marginLeft: 'auto',
  },
});
