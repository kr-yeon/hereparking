import styled from 'styled-components/native';
import {Color} from '../../values';

export default styled.TextInput`
  width: 90%;
  height: 50px;
  font-size: 15px;
  font-family: sans-serif;
  background-color: ${Color.TextBoxColor_silver};
  margin-top: 5%;
  padding-left: 12px;
  padding-right: 12px;
  color: ${Color.Black};
`;
