import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Color} from '../../values';

export const FlexScroll = styled.ScrollView`
  flex: 1;
`;

export const Root = styled.SafeAreaView`
  flex: 1;
  background-color: ${Color.White};
`;

export const BackGround = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  background-color: ${Color.White};
`;

export const CircleView = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 10000px;
  background-color: ${Color.CircleView};
`;

export const ImageCircle = styled.ImageBackground`
  width: 100%;
  border-radius: 10000px;
`;

export const OpacityCircle = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 10000px;
  background-color: ${Color.Black};
  opacity: 0.55;
`;

export const SupportLine = styled.View`
  width: 90%;
  height: 1px;
  margin-top: 5%;
  background-color: ${Color.LineColor};
`;
export default StyleSheet.create({
  icon: {
    position: 'absolute',
  },
  inputView: {
    marginTop: '13%',
  },
  rippleView: {
    width: '35%',
    borderRadius: 10000,
    marginTop: '10%',
  },
});
