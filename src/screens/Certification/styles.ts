import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Color, Font} from '../../values';

export const BackGround = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  background-color: ${Color.White};
`;

export const ResText = styled.Text`
  width: 90%;
  color: ${Color.Res};
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
`;

export const HorizonView = styled.View`
  display: flex;
  width: 90%;
  flex-direction: row;
  align-items: center;
`;

export const RequestButton = styled.Text`
  font-family: ${Font.NotoSansKR};
  text-align: center;
  line-height: 50px;
  width: 100%;
  height: 50px;
  border-width: 1px;
  border-color: ${Color.Res};
  color: ${Color.Res};
  border-radius: 5px;
`;

export default StyleSheet.create({
  phoneNumberInput: {
    width: '70%',
  },
  touchable: {
    width: '27%',
    height: 50,
    marginTop: '5%',
    marginLeft: 'auto',
    borderRadius: 5,
  },
});
