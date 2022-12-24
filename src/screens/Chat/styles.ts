import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Color, Font} from '../../values';

export const BackGround = styled.SafeAreaView`
  flex: 1;
  background-color: ${Color.White};
`;

export const Line = styled.View`
  width: 90%;
  height: 1px;
  background-color: ${Color.LineColor};
  margin-left: auto;
  margin-right: auto;
`;

export const Nick = styled.Text`
  font-family: ${Font.NotoSansKRBold};
  font-size: 16px;
  color: ${Color.Black};
`;

export const ModalButton = styled.Text`
  font-family: ${Font.NotoSansKRBold};
  font-size: 14px;
  color: ${Color.Res};
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
`;

export default StyleSheet.create({
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    height: 148,
    backgroundColor: Color.White,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  fullWidth: {
    width: '100%',
  },
});
