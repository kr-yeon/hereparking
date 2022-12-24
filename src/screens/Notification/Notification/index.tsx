import React from 'react';
import {HorizonView, Root, Time, Title, Res} from './styles';

interface Props {
  title: string;
  time: number;
  res: string;
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
    <Root>
      <HorizonView>
        <Title>{props.title}</Title>
        <Time>{timeForToday(props.time)}</Time>
      </HorizonView>
      <Res>{props.res}</Res>
    </Root>
  );
}
