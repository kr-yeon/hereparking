import styled from 'styled-components/native';
import {StyleSheet, Dimensions} from 'react-native';
import {Color, Font} from '../../values';

interface HeaderProps {
  opacity: number;
}

interface DotProps {
  size: number;
  color: string;
}

export const Root = styled.SafeAreaView`
  flex: 1;
  background-color: white;
  align-items: center;
`;

export const Scroll = styled.ScrollView`
  flex: 1;
  width: 100%;
  z-index: 0;
`;

export const Header = styled.View<HeaderProps>`
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, ${props => props.opacity});
  position: absolute;
  top: 0;
  z-index: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${Color.LineColor};
`;

export const TextView = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Text = styled.Text`
  width: 70%;
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 5px;
  padding-left: 6%;
  color: ${Color.Black};
`;

export const DateText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 11px;
  margin-left: auto;
  padding-right: 6%;
  color: ${Color.Black};
`;

export const Line = styled.View`
  width: 95%;
  height: 1px;
  background-color: ${Color.LineColor};
  margin-left: auto;
  margin-right: auto;
`;

export const InfoView = styled.View`
  width: ${Dimensions.get('window').width -
  Dimensions.get('window').width / 9 -
  113}px;
`;

export const TimeView = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Res = styled.Text`
  font-family: ${Font.NotoSansKR};
  line-height: 14px;
  font-size: 12px;
  padding-left: 6%;
  color: ${Color.Res};
`;

export const TimeText = styled.Text`
  font-family: ${Font.NotoSansKR};
  line-height: 14px;
  font-size: 12px;
  padding-left: 5%;
  color: ${Color.Black};
`;

export const IconsView = styled.View`
  margin-left: auto;
  margin-right: 4%;
`;

export const Line2 = styled.View`
  width: 95%;
  height: 1px;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
  background-color: ${Color.LineColor};
`;

export const LocationView = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-left: 6%;
  margin-right: 6%;
  margin-bottom: 15px;
`;

export const LocationText = styled.Text`
  width: 97%;
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
  margin-top: 8px;
  padding-left: 6%;
  color: ${Color.Black};
`;

export const CopyButton = styled.Text`
  width: 90px;
  height: 32px;
  border-radius: 10px;
  border-color: ${Color.LineColor};
  color: ${Color.Res};
  border-width: 1px;
  font-family: ${Font.NotoSansKR};
  line-height: 32px;
  font-size: 11px;
  text-align: center;
`;

export const BottomSheet = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  height: 70px;
  border-top-color: ${Color.LineColor};
  border-top-width: 1px;
`;

export const BottomInfo = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${Dimensions.get('window').width -
  Dimensions.get('window').width / 10 -
  105}px;
  margin-left: 6%;
`;

export const BottomText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 14px;
  color: ${Color.Black};
  line-height: 33px;
  margin-bottom: 6px;
  height: 22px;
  margin-left: 10px;
`;

export const BottomRes = styled.Text`
  font-family: ${Font.NotoSansKR};
  line-height: 14px;
  font-size: 12px;
  color: ${Color.Res};
  margin-left: 7px;
`;

export const BottomButton = styled.Text`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-color: ${Color.Black};
  border-width: 1px;
  border-radius: 10px;
  color: ${Color.Black};
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
`;

export const ScoreBox = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 12px;
  line-height: 32px;
  text-align: center;
  width: 45px;
  height: 30px;
  border-radius: 8px;
  background-color: ${Color.ActiveColor};
  color: ${Color.White};
`;

export const BannerImage = styled.Image`
  width: 100%;
  height: 300px;
`;

export const DotView = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 15px;
`;

export const MarkerImage = styled.Image`
  width: 30px;
  height: 30px;
`;

export const Dot = styled.View<DotProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size}px;
  background-color: ${props => props.color};
  margin-left: 3px;
  margin-right: 3px;
`;

export default StyleSheet.create({
  pager_view: {
    width: '100%',
    height: 300,
  },
  map: {
    width: '88%',
    paddingBottom: '88%',
    marginTop: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  location_icon: {
    marginTop: 15,
  },
  delPadding: {
    paddingLeft: '2%',
  },
  rippleView: {
    width: 90,
    height: 32,
    borderRadius: 10,
    marginTop: 15,
  },
  bottomRippleView: {
    width: 100,
    height: 40,
    borderRadius: 10,
  },
  icons: {
    marginTop: 8,
  },
  headerButton: {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    left: 10,
    borderRadius: 30,
  },
  button_disable: {
    borderColor: Color.LineColor,
    color: Color.LineColor,
  },
});
