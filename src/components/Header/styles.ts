import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Color, Font} from '../../values';

export const Header = styled.View`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  border-bottom-color: ${Color.LineColor};
  border-bottom-width: 1px;
  align-items: center;
  background-color: ${Color.White};
`;

export default StyleSheet.create({
  button: {
    marginLeft: 'auto',
  },
  button_label: {
    fontFamily: Font.NotoSansKR,
    fontSize: 14,
  },
  view_text: {
    fontFamily: Font.NotoSansKR,
    fontSize: 16,
    color: Color.Black,
  },
  icon: {
    margin: 0,
  },
});
