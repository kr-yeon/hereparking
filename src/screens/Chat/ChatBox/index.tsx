import React from 'react';
import {
  Root,
  CircleView,
  NickName,
  Chat,
  Info,
  HorizonView,
  Time,
  ImageCircle,
  NotRead,
} from './styles';
import {TouchableRipple} from 'react-native-paper';

interface Props {
  nickname: string;
  lastChat: string;
  lastChatTime: number;
  notRead: string;
  image?: string;
  onPress?: () => any;
  onLongPress?: () => any;
}

function timeForToday(value: number): string {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60,
  );
  if (betweenTime < 1) {
    return '방금 전';
  }
  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일 전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년 전`;
}

export default function (props: Props) {
  return (
    <TouchableRipple
      onPress={() => (props.onPress ?? (() => {}))()}
      onLongPress={() => (props.onLongPress ?? (() => {}))()}
      borderless={true}>
      <Root>
        {props.image ? (
          <ImageCircle source={{uri: props.image}} resizeMode={'cover'} />
        ) : (
          <CircleView />
        )}
        <Info>
          <HorizonView>
            <NickName numberOfLines={1} ellipsizeMode={'tail'}>
              {props.nickname}
            </NickName>
            <Time>{timeForToday(props.lastChatTime)}</Time>
          </HorizonView>
          <Chat numberOfLines={1} ellipsizeMode={'tail'}>
            {props.lastChat}
          </Chat>
        </Info>
        {props.notRead === '0' ? null : (
          <NotRead>{props.notRead}</NotRead>
        )}
      </Root>
    </TouchableRipple>
  );
}
