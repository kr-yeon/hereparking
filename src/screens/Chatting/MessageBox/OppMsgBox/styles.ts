import styled from 'styled-components/native';
import {Color, Font} from '../../../../values';

export const View = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Text = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 12px;
  line-height: 15px;
  padding: 10px 14px;
  background-color: ${Color.OppChat};
  border-radius: 20px;
  border-top-left-radius: 0;
  color: ${Color.Black};
  max-width: 60%;
  margin-left: 3%;
  margin-top: 10px;
`;

export const Time = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 10px;
  line-height: 11px;
  color: ${Color.Res};
  margin-top: auto;
  margin-left: 5px;
`;
