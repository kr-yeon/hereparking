import {StyleSheet} from 'react-native';
import {Font} from '../../values';

export default StyleSheet.create({
  title: {
    fontFamily: Font.NotoSansKR,
    fontSize: 16,
  },
  load_content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  load_res: {
    fontFamily: Font.NotoSansKR,
    fontSize: 13,
    marginLeft: 10,
  },
});
