import React from 'react';
import {StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper';
import styled from 'styled-components/native';
import {Color, Font} from '../../values';

export interface AgreementResTextProps {
  color?: string;
}

export interface AgreementCheckButtonProps {
  text: string;
  isCheck: boolean;
  disable: boolean;
  res?: string;
  onPress?: Function;
  onResPress?: Function;
}

export const BackGround = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  background-color: ${Color.White};
`;

export const AgreementResView = styled.View`
  display: flex;
  flex-direction: row;
  width: 90%;
  padding-right: 25px;
`;

export const AgreementResText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 12px;
  color: ${({color}: AgreementResTextProps) => color ?? Color.Res};
  margin-top: 0.3%;
`;

export const AgreeCheckView = styled.View`
  display: flex;
  width: 90%;
  align-items: flex-start;
  margin-top: 3%;
`;

export const SupportLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${Color.AgreementLine};
  margin-top: 4px;
  margin-bottom: 4px;
`;

const AgreementCheckText = styled.Text`
  font-family: ${Font.NotoSansKR};
  font-size: 13px;
  color: ${Color.Black};
`;

const AgreementWithRes = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const checkButtonStyles = StyleSheet.create({
  defaultStyle: {
    height: 40,
  },
  resStyle: {
    color: Color.CheckBox,
    textDecorationLine: 'underline',
    marginLeft: 'auto',
    marginRight: 12,
  },
  resButtonStyle: {
    height: 40,
    marginLeft: 'auto',
  },
});

export function AgreementCheckButton(props: AgreementCheckButtonProps) {
  return (
    <AgreementWithRes>
      <Button
        color={Color.Black}
        mode={'text'}
        compact={true}
        dark={false}
        disabled={props.disable}
        style={checkButtonStyles.defaultStyle}
        contentStyle={checkButtonStyles.defaultStyle}
        labelStyle={checkButtonStyles.defaultStyle}
        onPress={() => (props.onPress ?? (() => {}))()}>
        <MaterialCommunityIcons
          name={'check-circle'}
          size={18}
          color={props.isCheck ? Color.ActiveColor : Color.CheckBox}
        />
        <AgreementCheckText>{'  ' + props.text}</AgreementCheckText>
      </Button>
      {props.res ? (
        <Button
          color={Color.Black}
          mode={'text'}
          compact={true}
          dark={false}
          style={checkButtonStyles.resButtonStyle}
          contentStyle={checkButtonStyles.defaultStyle}
          labelStyle={checkButtonStyles.defaultStyle}
          onPress={() => (props.onResPress ?? (() => {}))()}>
          <AgreementResText style={checkButtonStyles.resStyle}>
            보기
          </AgreementResText>
        </Button>
      ) : null}
    </AgreementWithRes>
  );
}
