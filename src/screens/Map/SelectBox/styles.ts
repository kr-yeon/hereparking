import styled from 'styled-components/native';
import {Color, Font} from '../../../values';
import {Dimensions, StyleSheet} from 'react-native';

export const Box = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 170px;
  background-color: ${Color.White};
  border-radius: 8px;
  align-items: center;
`;

export const Image = styled.Image`
  width: 32%;
  height: 145px;
  border-radius: 5px;
  margin-left: 3%;
`;

export const InfoView = styled.View`
  width: ${Dimensions.get('window').width -
  Dimensions.get('window').width * (29 / 100) -
  92}px;
  margin: 16px 2%;
`;

export const Info = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Text = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 12px;
  color: ${Color.Black};
  line-height: 18px;
  margin-left: 2%;
`;

export const MoneyText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 24px;
  color: ${Color.Black};
  line-height: 26px;
  margin-left: 2%;
`;

export const ScoreBox = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 12px;
  line-height: 32px;
  text-align: center;
  width: 45px;
  height: 30px;
  border-radius: 8px;
  position: absolute;
  right: 8px;
  bottom: 8px;
  background-color: ${Color.ActiveColor};
  color: ${Color.White};
`;

export default StyleSheet.create({
  Ripple: {
    width: '90%',
    borderRadius: 8,
    position: 'absolute',
    bottom: 65,
    zIndex: 1,
    elevation: 4,
  },
  TextMargin: {
    marginTop: '6%',
  },
});
