import styled from 'styled-components/native';
import {Color, Font} from '../../../values';
import {Dimensions} from 'react-native';

export const Root = styled.View`
  display: flex;
  width: 100%;
  height: 95px;
  background-color: ${Color.White};
  flex-direction: row;
`;

export const CircleView = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 10000px;
  background-color: ${Color.CircleView};
  margin-left: 3.5%;
  margin-top: auto;
  margin-bottom: auto;
`;

export const ImageCircle = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 10000px;
  margin-left: 3.5%;
  margin-top: auto;
  margin-bottom: auto;
`;

export const Info = styled.View`
  width: ${Dimensions.get('window').width -
  97 -
  Dimensions.get('window').width * 0.14}px;
  margin-left: 3.5%;
`;

export const NickName = styled.Text`
  font-family: ${Font.NotoSansKRBold};
  color: ${Color.Black};
  font-size: 15px;
  height: 18px;
  line-height: 18px;
  margin-top: 29.5px;
`;

export const Chat = styled.Text`
  font-family: ${Font.NotoSansKR};
  color: ${Color.Res};
  font-size: 11px;
  height: 13px;
  line-height: 13px;
  margin-top: 5px;
`;

export const HorizonView = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Time = styled.Text`
  font-family: ${Font.NotoSansKR};
  color: ${Color.Res};
  font-size: 11px;
  height: 14px;
  line-height: 14px;
  margin-top: 31.5px;
  margin-left: 8px;
`;

export const NotRead = styled.Text`
  font-family: ${Font.NotoSansKR};
  color: ${Color.White};
  font-size: 10px;
  line-height: 27px;
  width: 25px;
  height: 25px;
  text-align: center;
  background-color: ${Color.ActiveColor};
  margin-left: 3.5%;
  border-radius: 30px;
  margin-top: auto;
  margin-bottom: auto;
`;
