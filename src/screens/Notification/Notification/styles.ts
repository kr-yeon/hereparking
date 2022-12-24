import styled from 'styled-components/native';
import {Color, Font} from '../../../values';

export const Root = styled.View`
  width: 100%;
  height: 60px;
`;

export const HorizonView = styled.View`
  display: flex;
  flex-direction: row;
  height: 36px;
`;

export const Title = styled.Text`
  font-family: ${Font.NotoSansKRBold};
  font-size: 14px;
  color: ${Color.Black};
  margin-left: 7%;
  margin-top: 10px;
  height: 26px;
`;

export const Time = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 11px;
  color: ${Color.Res};
  margin-left: 3%;
  margin-top: 14px;
`;

export const Res = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 11px;
  color: ${Color.Res};
  margin-left: 7%;
  margin-top: 2px;
`;
