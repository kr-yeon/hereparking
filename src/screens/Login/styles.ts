import {StyleSheet} from 'react-native';
import {Color, Font} from '../../values';
import styled from 'styled-components/native';

export const BackGround = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  background-color: ${Color.ThemeColor};
`;

export const LoginBox = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-radius: 10px;
  background-color: ${Color.Kakao};
  color: ${Color.Black};
`;

export default StyleSheet.create({
  logo: {
    width: '60%',
    marginTop: '40%',
  },
  loginRipple: {
    width: '85%',
    height: 50,
    marginTop: '15%',
    borderRadius: 10,
  },
});
