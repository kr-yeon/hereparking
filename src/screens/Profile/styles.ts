import styled from 'styled-components/native';
import {Color, Font} from '../../values';
import {StyleSheet} from 'react-native';

export const Root = styled.SafeAreaView`
  flex: 1;
  background-color: ${Color.White};
`;

export const Scroll = styled.ScrollView`
  flex: 1;
`;

export const UserInfoView = styled.View`
  width: 90%;
  height: 175px;
  border-radius: 10px;
  background-color: ${Color.White};
  border-width: 1px;
  border-color: ${Color.LineColor};
  margin-top: 22px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
`;

export const UserInfo = styled.View`
  display: flex;
  width: 68%;
`;

export const HorizonView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CircleView = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  padding-bottom: 90px;
  border-radius: 10000px;
  background-color: ${Color.CircleView};
  margin-left: 3.5%;
  margin-top: 13px;
  margin-bottom: 15px;
`;

export const ImageCircle = styled.Image`
  width: 90px;
  padding-bottom: 90px;
  border-radius: 10000px;
  margin-left: 3.5%;
  margin-top: 13px;
  margin-bottom: 15px;
`;

export const UserName = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 15px;
  color: ${Color.Black};
  line-height: 30px;
  height: 30px;
  margin-left: 3.5%;
`;

export const CarInfo = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 14px;
  color: ${Color.Res};
  line-height: 20px;
  height: 20px;
  margin-left: 3.5%;
`;

export const UserScore = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 15px;
  color: ${Color.Score};
  line-height: 30px;
  height: 30px;
  margin-left: auto;
  margin-right: 3.5%;
`;

export const ButtonText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 16px;
  color: ${Color.Black};
  line-height: 21px;
  height: 20px;
  margin-left: 5%;
`;

export const GuideText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 17px;
  color: ${Color.Black};
  line-height: 22px;
  margin-left: 2%;
  margin-bottom: 15px;
`;

export const Line = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${Color.LineColor};
`;

export const SettingView = styled.View`
  width: 90%;
  height: 111px;
  border-radius: 10px;
  background-color: ${Color.White};
  border-width: 1px;
  border-color: ${Color.LineColor};
  margin: 15px auto 20px;
  box-sizing: border-box;
`;

export default StyleSheet.create({
  textMargin: {
    marginLeft: '5%',
  },
  buttonArrow: {
    marginLeft: 'auto',
    marginTop: 1,
    marginRight: '3%',
  },
  topTouchRipple: {
    width: '100%',
    height: 54,
    borderTopRightRadius: 9,
    borderTopLeftRadius: 9,
    paddingTop: 15,
  },
  underTouchRipple: {
    width: '100%',
    height: 54,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    paddingTop: 15,
  },
});
