import {StyleSheet} from "react-native";
import styled from 'styled-components/native';
import {Font, Color} from '../../values';

interface TextProps {
  color?: string;
}

export const Root = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;

export const HorizonView = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Text = styled.Text<TextProps>`
  font-family: ${Font.NotoSansKR};
  font-size: 15px;
  line-height: 19px;
  margin: 20px 8%;
  color: ${props => props.color ?? Color.Black};
`;

export const Line = styled.View`
  width: 90%;
  height: 1px;
  margin-left: auto;
  margin-right: auto;
  background-color: ${Color.LineColor};
`;

export const Res = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 12px;
  line-height: 19px;
  margin: 20px 8% 20px auto;
  color: ${Color.Res};
`;

export default StyleSheet.create({
  switch: {
    marginLeft: 'auto',
    marginRight: '8%',
  },
});
