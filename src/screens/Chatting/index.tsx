import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles, {
  Address,
  BackGround,
  Input,
  Price,
  SendChat,
  Writing,
  WritingImage,
} from './styles';
import {Header} from '../../components';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import {Chat, DBChat, DBRoom} from '../../chat';
import {GlobalData} from '../../context';
import {BackHandler, FlatList} from 'react-native';
import {get_user, get_writing, WritingInfo} from '../../firebase/store';
import {IconButton, TouchableRipple} from 'react-native-paper';
import {ScreenNames} from '../../navigation/Stack';
import {Color} from '../../values';
import {sendNotification} from '../../api';
import {NotificationChannels} from '../../api/sendNotification';
import MyMsgBox from './MessageBox/MyMsgBox';
import OppMsgBox from './MessageBox/OppMsgBox';
import TimeBox from './MessageBox/TimeBox';

interface Props {
  route: any;
  navigation: StackNavigationHelpers;
}

interface IUData {
  profile_image: string;
  nick_name: string;
  tokens: Array<string>;
}

function getMoney(start: string, end: string): string {
  const hours = Number(end.split(':')[0]) - Number(start.split(':')[0]);
  const minutes = Number(end.split(':')[1]) - Number(start.split(':')[1]);

  return (hours * 3000 + (minutes / 10) * 500)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function timeForString(value: number) {
  const date = new Date(value);
  const h = date.getHours();

  return `${h > 11 || h === 24 ? '오후' : '오전'} ${
    h < 10 && h > 0 ? '0' : ''
  }${h > 12 ? (h - 12 === 0 ? 12 : h - 12) : h === 0 ? 12 : h}:${
    date.getMinutes() < 10 ? '0' : ''
  }${date.getMinutes()}`;
}

export default function ({route, navigation}: Props) {
  const {uid, setChatScreen, network, showNetworkAlert} =
    useContext(GlobalData);

  const [uData, setUData] = useState<IUData>({
    profile_image: '',
    nick_name: '',
    tokens: [],
  });
  const [myNick, setMyNick] = useState<string>('');
  const [chatList, _setChatList] = useState<Array<DBChat>>([]);
  const [writingData, setWritingData] = useState<WritingInfo>({
    uid: '',
    location: {
      longitude: 0,
      latitude: 0,
    },
    address: {
      address: '',
      detail_address: '',
    },
    images: [],
    start_time: '',
    end_time: '',
    upload_time: 0,
    reservation: false,
  });
  const [chatInput, setChatInput] = useState<string>('');
  const [wId, setWId] = useState<string>('');
  const [load, setLoad] = useState<boolean>(false);

  const chatRef = useRef(new Chat(uid, route.params.id));
  const chatListRef = useRef<Array<DBChat>>([]);
  const scrollV = useRef<FlatList>(null);

  const setChatList = useCallback((data: Array<DBChat>) => {
    chatListRef.current = data;
    _setChatList(chatListRef.current);
  }, []);

  useEffect(() => {
    if (!network) {
      showNetworkAlert(true);
      navigation.goBack();
      return;
    }

    setChatScreen(route.params.id);
    chatRef.current.enter();

    chatRef.current.getChat().then(s => {
      setChatList(s.reverse());
      scrollV.current?.scrollToEnd({animated: true});
    });

    chatRef.current?.getRoom().then(async s => {
      if (s.status && s.data) {
        const rD: DBRoom = s.data;
        const uD = await get_user(
          Object.keys(rD.users).filter(_ => _ !== uid)[0],
        );
        const wD = await get_writing(rD.data.writing);
        const mUD = await get_user(uid);

        if (uD.status && uD.data) {
          setUData({
            nick_name: uD.data.nick_name,
            profile_image: uD.data.profile_image,
            tokens: uD.data.token_list,
          });
        }

        if (wD.status && wD.data) {
          setWId(rD.data.writing);
          setWritingData(wD.data);
        }

        if (mUD.status && mUD.data) {
          setMyNick(mUD.data.nick_name);
        }
      }
      scrollV.current?.scrollToEnd({animated: true});
    });

    chatRef.current.onChatEvent(_ => {
      chatRef.current
        .getChat(chatListRef.current[chatListRef.current.length - 1].sendAt)
        .then(s => {
          setChatList(chatListRef.current.concat(s.reverse()));
          scrollV.current?.scrollToEnd({animated: true});
        });
    });

    function handleBackButton() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    setLoad(true);
    scrollV.current?.scrollToEnd({animated: true});

    return () => {
      chatRef.current.leave();
      setChatScreen('');
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return load ? (
    <BackGround>
      <Header
        viewText={uData.nick_name ? uData.nick_name : '탈퇴한 사용자'}
        backPress={() => {
          navigation.goBack();
        }}
        icon={'dots-vertical'}
      />
      <TouchableRipple
        borderless={true}
        onPress={() => {
          navigation.navigate(ScreenNames.Read, {
            id: wId,
          });
        }}>
        <Writing>
          <WritingImage
            source={{
              uri: writingData.images[0] + '&' + writingData.upload_time,
            }}
            resizeMode={'cover'}
          />
          <Address>{writingData.address.address}</Address>
          <Price>
            {getMoney(writingData.start_time, writingData.end_time)}원
          </Price>
        </Writing>
      </TouchableRipple>
      <FlatList
        ref={scrollV}
        data={chatList}
        onScroll={ev => {
          if (ev.nativeEvent.contentOffset.y === 0) {
            // chatRef.current?.getChat(chatList[0].sendAt).then(s => {
            // chatRef.current?.getChat(chatList[0].sendAt).then(s => {
            //   setChatList([...s, ...chatList]);
            // });
          }
        }}
        renderItem={({item, index}) => {
          if (item.type === 'text') {
            if (item.userId === uid) {
              return (
                <MyMsgBox
                  msg={item.message}
                  time={timeForString(item.sendAt)}
                  style={
                    index === chatList.length - 1 ? styles.marginBottom : {}
                  }
                  key={index}
                />
              );
            } else {
              return (
                <OppMsgBox
                  msg={item.message}
                  time={timeForString(item.sendAt)}
                  style={
                    index === chatList.length - 1 ? styles.marginBottom : {}
                  }
                  key={index}
                />
              );
            }
          } else if (item.type === 'date') {
            return <TimeBox msg={item.message} />;
          } else {
            return null;
          }
        }}
      />
      <SendChat>
        <IconButton
          icon={'image'}
          size={25}
          color={Color.ChatIcon}
          onPress={() => {}}
        />
        <Input
          placeholder={'메세지를 입력하세요.'}
          placeholderTextColor={Color.PlaceholderTextColor}
          value={chatInput}
          onChangeText={setChatInput}
          onPressOut={() => scrollV.current?.scrollToEnd({animated: false})}
        />
        <IconButton
          icon={'send'}
          size={25}
          color={Color.ChatIcon}
          style={styles.marginLeftF}
          onPress={() => {
            if (chatInput !== '') {
              if (!network) {
                showNetworkAlert(true);
                return;
              }
              setChatInput('');
              chatRef.current.send('text', chatInput).then(_ => {
                sendNotification(
                  uData.tokens,
                  myNick,
                  chatInput,
                  NotificationChannels.chat,
                  {
                    roomId: route.params.id,
                  },
                );
                scrollV.current?.scrollToEnd({animated: true});
              });
            }
          }}
        />
      </SendChat>
    </BackGround>
  ) : null;
}
