import {StyleSheet} from 'react-native';
import {Color, Font} from '../../values';

export default StyleSheet.create({
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
    borderRadius: 10,
    marginTop: '4%',
  },
  button_content: {
    height: 50,
  },
  button_label: {
    width: '95%',
    color: Color.ActiveTextColor,
    fontFamily: Font.NotoSansKR,
    lineHeight: 19,
  },
});
