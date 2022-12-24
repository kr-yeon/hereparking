import {StyleSheet, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {Color, Font} from '../../values';

export const Root = styled.SafeAreaView`
  flex: 1;
  background-color: white;
  align-items: center;
`;

export const Scroll = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

export const Text = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
  margin: 8px 6%;
  color: ${Color.Black};
`;

export const SelectTimeText = styled.Text`
  height: 26px;
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
  margin-left: 6%;
  color: ${Color.Black};
`;

export const Line = styled.View`
  width: 95%;
  height: 1px;
  background-color: ${Color.LineColor};
  margin-left: auto;
  margin-right: auto;
`;

export const ResText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 12px;
  margin: 0 6%;
  color: ${Color.Res};
`;

export const PhotoZone = styled.ScrollView`
  width: 100%;
`;

export const MarginView = styled.View`
  width: ${Dimensions.get('window').width / 33.333333}px;
`;

export const PhotoBox = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 15px;
  background-color: ${Color.TextBoxColor_silver};
`;

export const PhotoImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 15px;
`;

export const MarkerImage = styled.Image`
  width: 30px;
  height: 30px;
`;

export const SetTimeView = styled.Text`
  line-height: 50px;
  text-align: center;
  font-family: ${Font.NotoSansKR};
  font-size: 14px;
  color: ${Color.Black};
  border-width: 1px;
  border-color: ${Color.setTime};
  border-radius: 10px;
`;

export default StyleSheet.create({
  map: {
    width: '88%',
    paddingBottom: '88%',
    marginTop: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  input: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 150,
    padding: 15,
  },
  rippleView: {
    width: 120,
    height: 120,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
  },
  timeRippleView: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  finishButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
    marginTop: 20,
    marginBottom: 10,
  },
  topMargin: {
    marginTop: 10,
  },
});
