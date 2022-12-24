import styled from 'styled-components/native';
import {Dimensions, StyleSheet} from 'react-native';
import {Color, Font} from '../../values';

export const Image = styled.Image`
  width: 26%;
  padding-bottom: 26%;
  margin-left: 3%;
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
`;

export const Root = styled.View`
  display: flex;
  flex-direction: row;
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
  margin-right: 4%;
`;

export const Reservation = styled.Text`
  width: 50px;
  height: 25px;
  background-color: ${Color.ActiveColor};
  border-radius: 3px;
  font-family: ${Font.NotoSansKR};
  font-size: 10px;
  color: ${Color.White};
  text-align: center;
  line-height: 26.5px;
  position: absolute;
  right: 15px;
  top: 16px;
`;

export const ReservationClear = styled.Text`
  width: 14%;
  height: 25px;
  background-color: ${Color.White};
  border-radius: 3px;
  font-family: ${Font.NotoSansKR};
  border-color: ${Color.Res};
  border-width: 1.5px;
  font-size: 10px;
  color: ${Color.Res};
  text-align: center;
  line-height: 26.5px;
  position: absolute;
  right: 15px;
  top: 16px;
`;

export const BottomText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 11px;
  color: ${Color.Res};
  position: absolute;
  right: 15px;
  bottom: 16px;
`;

export default StyleSheet.create({
  Ripple: {
    width: '100%',
    backgroundColor: Color.White,
  },
  RippleLine: {
    borderBottomColor: Color.LineColor,
    borderBottomWidth: 1,
  },
  TextMargin: {
    marginTop: '6%',
  },
});
