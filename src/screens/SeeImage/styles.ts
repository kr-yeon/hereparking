import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {Color} from '../../values';

interface DotProps {
  size: number;
  color: string;
}

export const Image = styled.Image`
  flex: 1;
  width: 100%;
`;

export const DotView = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: 20px;
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
  paperView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Color.Black,
  },
  backIcon: {
    margin: 0,
    position: 'absolute',
    zIndex: 1,
    top: 5,
  },
});
