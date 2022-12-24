import styled from 'styled-components/native';
import {Color, Font} from '../../../../values';

export const Text = styled.Text`
  background-color: ${Color.TimeBox};
  color: ${Color.Time};
  font-family: ${Font.NotoSansKR};
  font-size: 11px;
  width: 70%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;
  margin-top: 10px;
`;
