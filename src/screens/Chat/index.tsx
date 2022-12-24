import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles, {BackGround, Line, ModalButton, Nick} from './styles';
import {StackNavigationHelpers} from '@react-navigation/stack/src/types';
import {Alert, LogoHeader} from '../../components';
import {ChatProvider, ChatContext, Chat} from '../../chat';
import {GlobalData} from '../../context';
import {delChatList, get_user, UserInfo} from '../../firebase/store';
import firestore from '@react-native-firebase/firestore';
import {FlatList, View, ScrollView, RefreshControl} from 'react-native';
import ChatBox from './ChatBox';
import {Portal, Modal, TouchableRipple} from 'react-native-paper';
import {ScreenNames} from '../../navigation/Stack';

interface Props {
  stack_navigation: StackNavigationHelpers;
  onRefresh: () => void;
  refreshing: boolean;
}

function ConsumerSection({stack_navigation, onRefresh, refreshing}: Props) {
  const {roomInfos, roomChats} = useContext(ChatContext);
  const {uid, network, showNetworkAlert} = useContext(GlobalData);

  const [uData, setUData] = useState<{
    [key: string]: {
      profile_image: string;
      nick_name: string;
    };
  }>({});
  const [chats, setChats] = useState<Array<string>>([]);
  const [modalName, setModalName] = useState<string>('');

  const addUData = useCallback(
    async s => {
      if (!uData[s]) {
        const user = await get_user(
          Object.keys(roomInfos[s].users).filter(_ => _ !== uid)[0],
        );

        if (user.data) {
          setUData({
            ...uData,
            [s]: {
              profile_image: user.data.profile_image
                ? user.data.profile_image + '&' + Date.now()
                : '',
              nick_name: user.data.nick_name,
            },
          });
        }
      }
    },
    [roomInfos, uData],
  );

  useEffect(() => {
    Object.keys(roomInfos).forEach(s => {
      addUData(s);
    });
  }, [addUData, roomInfos]);

  useEffect(() => {
    setChats(
      Object.keys(roomChats).sort((x, y) => {
        if (roomChats[x] && roomChats[y]) {
          return roomChats[y].lastChatTime - roomChats[x].lastChatTime;
        } else {
          return 0;
        }
      }),
    );
  }, [roomChats]);

  return (
    <BackGround>
      <LogoHeader />
      <Portal>
        <Modal
          visible={modalName !== ''}
          onDismiss={() => setModalName('')}
          contentContainerStyle={styles.modalContainer}>
          <Nick>{uData[modalName]?.nick_name}</Nick>
          <Line style={styles.fullWidth} />
          <TouchableRipple
            style={styles.fullWidth}
            onPress={() => {
              if (!network) {
                showNetworkAlert(true);
              } else {
                new Chat(uid, modalName).setNotification(
                  !roomInfos[modalName]?.users[uid].notification,
                );
              }
              setModalName('');
            }}
            borderless={true}>
            <ModalButton>
              {roomInfos[modalName]?.users[uid].notification
                ? '알림 끄기'
                : '알림 켜기'}
            </ModalButton>
          </TouchableRipple>
          <Line style={styles.fullWidth} />
          <TouchableRipple
            style={styles.fullWidth}
            onPress={() => {
              if (!network) {
                showNetworkAlert(true);
              } else {
                setChats(chats.filter(s => s !== modalName));
                delChatList(uid, modalName).then(_ => {
                  new Chat(uid, modalName).quit();
                });
              }
              setModalName('');
            }}
            borderless={true}>
            <ModalButton>채팅방 나가기</ModalButton>
          </TouchableRipple>
        </Modal>
      </Portal>
      <FlatList
        data={chats}
        renderItem={({item, index}) => {
          if (roomInfos[item] && uData[item]) {
            return (
              <View key={item}>
                <ChatBox
                  image={uData[item].profile_image}
                  nickname={uData[item].nick_name}
                  lastChat={roomChats[item].lastChat}
                  lastChatTime={roomChats[item].lastChatTime}
                  notRead={roomInfos[item].notRead}
                  onPress={() => {
                    stack_navigation.navigate(ScreenNames.Chatting, {
                      id: item,
                    });
                  }}
                  onLongPress={() => {
                    setModalName(item);
                  }}
                />
                {Object.keys(roomChats).length - 1 !== index ? <Line /> : null}
              </View>
            );
          } else if (roomInfos[item]) {
            return (
              <View key={item}>
                <ChatBox
                  image={''}
                  nickname={'탈퇴한 사용자'}
                  lastChat={roomChats[item].lastChat}
                  lastChatTime={roomChats[item].lastChatTime}
                  notRead={roomInfos[item].notRead}
                  onPress={() => {
                    stack_navigation.navigate(ScreenNames.Chatting, {
                      id: item,
                    });
                  }}
                  onLongPress={() => {
                    setModalName(item);
                  }}
                />
                {Object.keys(roomChats).length - 1 !== index ? <Line /> : null}
              </View>
            );
          } else {
            return null;
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </BackGround>
  );
}

export default function ({stack_navigation}: Props) {
  const {uid, network, showNetworkAlert} = useContext(GlobalData);

  const [rooms, setRooms] = useState<Array<string>>([]);
  const [load, setLoad] = useState<boolean>(false);
  const [no_load, set_no_load] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const Snapshow = useRef<Function>();

  const onRefresh = useCallback(() => {
    if (!network) {
      showNetworkAlert(true);
    } else {
      get_user(uid).then(s => {
        if (!s.status) {
          set_no_load(true);
        } else {
          if (Snapshow.current) {
            Snapshow.current();
          }
          Snapshow.current = firestore()
            .collection('users')
            .doc(uid)
            .onSnapshot(data => {
              if (rooms !== (data.data() as UserInfo)?.chat_list) {
                setLoad(false);
                setRooms((data.data() as UserInfo)?.chat_list ?? []);
                setLoad(true);
              }
            });
        }
        setRefreshing(false);
      });
    }
  }, [network, rooms]);

  useEffect(() => {
    if (!network) {
      showNetworkAlert(true);
    } else {
      get_user(uid).then(s => {
        if (!s.status) {
          set_no_load(true);
        } else {
          Snapshow.current = firestore()
            .collection('users')
            .doc(uid)
            .onSnapshot(data => {
              if (rooms !== (data.data() as UserInfo)?.chat_list) {
                setLoad(false);
                setRooms((data.data() as UserInfo)?.chat_list ?? []);
                setLoad(true);
              }
            });
          return Snapshow.current;
        }
      });
    }
  }, []);

  return load ? (
    <ChatProvider
      config={{
        uid,
        docs: rooms,
      }}>
      <Alert
        visible={no_load}
        setVisible={set_no_load}
        res={'정보를 불러오는데 실패했습니다. 새로고침을 해주세요.'}
      />
      <ConsumerSection
        stack_navigation={stack_navigation}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </ChatProvider>
  ) : (
    <BackGround>
      <LogoHeader />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </BackGround>
  );
}
