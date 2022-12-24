import styled from 'styled-components/native';
import {Color, Font} from '../../values';

export const BackGround = styled.SafeAreaView`
  flex: 1;
  background-color: ${Color.White};
`;

export const Text = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
  color: ${Color.Black};
  margin-left: 10px;
  margin-right: 10px;
`;

export const Scroll = styled.ScrollView`
  flex: 1;
  background-color: ${Color.White};
`;
