import {StyleSheet} from "react-native";
import {Font, Color} from '../../values';
import styled from 'styled-components/native';

interface LabelProps {
  color: string;
}

export const Label = styled.Text<LabelProps>`
  font-family: ${Font.NotoSansKR};
  font-size: 9px;
  height: 13px;
  line-height: 13px;
  margin-left: auto;
  margin-right: auto;
  color: ${props => props.color};
`;

export default StyleSheet.create({
  barStyle: {
    backgroundColor: Color.White,
  },
});
