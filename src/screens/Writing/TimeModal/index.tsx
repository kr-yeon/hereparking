import React, {forwardRef, ForwardedRef} from 'react';
import DatePicker from 'react-native-date-picker';
import {Button} from '../../../components';
import {Modalize} from 'react-native-modalize';
import styles, {BottomMargin} from './styles';

interface TimeModalProps {
  date: Date;
  setDate: any;
  current: Modalize | null;
  minimumDate?: Date;
}

export default forwardRef((props: TimeModalProps, ref: ForwardedRef<Modalize>) => {
    return (
      <Modalize
        ref={ref}
        adjustToContentHeight={true}
        childrenStyle={styles.modal}>
        <DatePicker
          date={props.date}
          locale={'ko'}
          mode={'time'}
          androidVariant={'nativeAndroid'}
          onDateChange={props.setDate}
          style={styles.modalChild}
          textColor={'black'}
          minuteInterval={10}
          minimumDate={props.minimumDate ?? new Date()}
        />
        <Button
          text={'확인'}
          style={styles.confirmButton}
          onPress={() => props.current?.close()}
        />
        <BottomMargin />
      </Modalize>
  );
});
