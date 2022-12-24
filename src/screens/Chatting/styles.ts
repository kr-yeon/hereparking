import styled from 'styled-components/native';
import {Color, Font} from '../../values';
import {Dimensions, StyleSheet} from 'react-native';

export const BackGround = styled.SafeAreaView`
  flex: 1;
  background-color: ${Color.ChatBackground};
`;

export const Writing = styled.View`
  width: 100%;
  height: 70px;
  background-color: ${Color.White};
  display: flex;
  flex-direction: row;
  border-bottom-color: ${Color.LineColor};
  border-bottom-width: 1px;
  align-items: center;
`;

export const WritingImage = styled.Image`
  width: 55px;
  height: 55px;
  margin-left: 2%;
  margin-right: 3%;
  border-radius: 5px;
`;

export const Address = styled.Text`
  width: ${Dimensions.get('window').width -
  124 -
  Dimensions.get('window').width / (100 / 11)}px;
  font-family: ${Font.NotoSansKR};
  color: ${Color.Black};
  font-size: 13px;
`;

export const Price = styled.Text`
  font-family: ${Font.NotoSansKRBold};
  color: ${Color.Black};
  font-size: 13px;
  margin-left: auto;
  margin-right: 3%;
`;

export const SendChat = styled.View`
  width: 100%;
  height: 60px;
  background-color: ${Color.ChatSend};
  margin-top: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Input = styled.TextInput`
  width: ${Dimensions.get('window').width - 105}px;
  height: 40px;
  background-color: ${Color.White};
  border-radius: 20px;
  font-size: 13px;
  padding-left: 12px;
  padding-right: 12px;
`;

export default StyleSheet.create({
  marginLeftF: {
    marginLeft: 'auto',
  },
  marginBottom: {
    marginBottom: 10,
  },
});
