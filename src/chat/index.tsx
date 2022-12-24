/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useCallback,
} from 'react';
import {AppState, NativeEventSubscription} from 'react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Image} from 'react-native-compressor';

const chatPhotoPrefix: string = 'Chat';
const chatPrefix: string = 'Chat-';
const roomCollectionName: string = 'chatRoom';
const week: Array<string> = ['일', '월', '화', '수', '목', '금', '토'];

interface Config {
  uid: string;
  docs: Array<string>;
}

interface ChatProps {
  children: React.ReactNode;
  config: Config;
}

interface User {
  [key: string]: {
    notification: boolean;
    LastRead: number;
  };
}

export interface DBRoom {
  name: string;
  image?: string;
  users: User;
  data: {[key: string]: any};
}

export interface DBChat {
  userId: string;
  type: 'text' | 'image' | 'date' | 'quit' | string;
  message: string;
  sendAt: number;
  uri?: string;
  data?: string;
}

interface Room {
  name: string;
  image: string;
  users: User;
  notRead: string;
}

interface LastChat {
  lastChat: string;
  lastChatTime: number;
}

interface RoomChats {
  [key: string]: LastChat;
}

interface RoomInfos {
  [key: string]: Room;
}

interface IChatDuplication {
  status: boolean;
  data?: string;
}

export const chatDuplication: Function = async (
  chatList: Array<string>,
  userList: Array<string>,
): Promise<IChatDuplication> => {
  try {
    for (let i = 0; i < chatList.length; i++) {
      const users = Object.keys(
        (
          (
            await firestore()
              .collection(roomCollectionName)
              .doc(chatList[i])
              .get()
          ).data() as DBRoom
        ).users,
      );

      if (JSON.stringify(users.sort()) === JSON.stringify(userList.sort())) {
        return {status: true, data: chatList[i]};
      }
    }
    return {status: true, data: ''};
  } catch (e) {
    return {status: false};
  }
};

export const createRoom: Function = async (
  userId: string,
  name: string,
  userList: Array<string>,
  image: string = '',
  data: {[key: string]: any} = {},
): Promise<string | boolean> => {
  try {
    const roomDoc = firestore().collection(roomCollectionName).doc();
    const date = new Date();
    await roomDoc.set({
      name,
      image,
      users: userList.reduce((target: User, key: string) => {
        target[key] = {notification: true, LastRead: date.getTime()};
        return target;
      }, {}),
      data,
    });
    await firestore()
      .collection(chatPrefix + roomDoc.id)
      .doc(String(date.getTime()))
      .set({
        userId,
        type: 'date',
        sendAt: date.getTime(),
        message:
          date.getFullYear() +
          '년 ' +
          (date.getMonth() + 1) +
          '월 ' +
          date.getDate() +
          '일 ' +
          week[date.getDay()] +
          '요일',
      });
    await firestore()
      .collection(chatPrefix + roomDoc.id)
      .doc(String(date.getTime() + 1))
      .set({
        userId,
        type: 'create_room',
        sendAt: date.getTime() + 1,
        message: '방이 생성되었습니다.',
      });

    return roomDoc.id;
  } catch (e) {
    return false;
  }
};
export const ChatContext = createContext<{
  roomInfos: RoomInfos;
  roomChats: RoomChats;
}>({
  roomInfos: {},
  roomChats: {},
});

export const ChatProvider: React.FC<ChatProps> = ({children, config}) => {
  const [roomInfos, _setRoomInfos] = useState<RoomInfos>({});
  const [roomChats, _setRoomChats] = useState<RoomChats>({});

  const roomInfosRef = useRef<RoomInfos>({});
  const roomChatsRef = useRef<RoomChats>({});

  const setRoomInfos = useCallback((data: RoomInfos) => {
    roomInfosRef.current = data;
    _setRoomInfos(data);
  }, []);

  const setRoomChats = useCallback((data: RoomChats) => {
    roomChatsRef.current = data;
    _setRoomChats(data);
  }, []);

  useEffect(() => {
    const roomCollection = firestore().collection(roomCollectionName);
    const snapshots: {[key: string]: Array<() => void>} = {};

    for (const i of config.docs) {
      const chatCollection = firestore()
        .collection(chatPrefix + i)
        .orderBy('sendAt', 'desc');

      if (!snapshots[i]) {
        snapshots[i] = [];
      }

      snapshots[i].push(
        chatCollection.onSnapshot(querySnapshot => {
          querySnapshot.query
            .limit(1)
            .get()
            .then(async s => {
              const data = s.docs[0].data() as DBChat;
              const notRead = await new Chat(config.uid, i).getChatSize(
                ((await roomCollection.doc(i).get()).data() as DBRoom).users[
                  config.uid
                ].LastRead,
              );

              setRoomChats({
                ...roomChatsRef.current,
                [i]: {
                  lastChat: data.message,
                  lastChatTime: data.sendAt,
                },
              });
              setRoomInfos({
                ...roomInfosRef.current,
                [i]: {
                  ...(roomInfosRef.current[i] ?? {}),
                  notRead: notRead >= 100 ? '99+' : String(notRead),
                },
              });
            });
        }),
      );
      snapshots[i].push(
        roomCollection.doc(i).onSnapshot(async documentSnapshot => {
          const notRead = await new Chat(config.uid, i).getChatSize(
            (documentSnapshot.data() as DBRoom).users[config.uid].LastRead,
          );

          setRoomInfos({
            ...roomInfosRef.current,
            [i]: {
              name: (documentSnapshot.data() as DBRoom).name,
              image: (documentSnapshot.data() as DBRoom).image ?? '',
              users: (documentSnapshot.data() as DBRoom).users,
              notRead: notRead >= 100 ? '99+' : String(notRead),
            },
          });
        }),
      );
    }

    return () => {
      Object.keys(snapshots).forEach(s => {
        snapshots[s].forEach(l => {
          l();
        });
      });
    };
  }, []);

  return (
    <ChatContext.Provider value={{roomInfos, roomChats}}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatConsumer = ChatContext.Consumer;

export class Chat {
  uId: string;
  chatId: string;
  isSee: boolean;
  chatFirst?: boolean;
  roomFirst?: boolean;
  AppStateEventListener?: NativeEventSubscription;
  ChatEventListener?: () => void;
  RoomEventListener?: () => void;
  ChatInitListener?: Function;

  constructor(uId: string, chatId: string) {
    this.uId = uId;
    this.chatId = chatId;
    this.isSee = true;
  }

  private AppStateListener(nextAppState: string): void {
    this.isSee = nextAppState === 'active';
  }

  async enter(): Promise<boolean> {
    try {
      this.AppStateEventListener = AppState.addEventListener(
        'change',
        this.AppStateListener.bind(this),
      );
      const roomDoc = firestore()
        .collection(roomCollectionName)
        .doc(this.chatId);
      const ChatCollection = firestore().collection(chatPrefix + this.chatId);

      await roomDoc.update({
        users: {
          ...((await roomDoc.get()).data() as DBRoom).users,
          [this.uId]: {
            ...((await roomDoc.get()).data() as DBRoom).users[this.uId],
            LastRead: Date.now(),
          },
        },
      });
      this.ChatInitListener = await ChatCollection.orderBy('sendAt', 'desc')
        .limit(1)
        .onSnapshot(async _ => {
          if (this.isSee) {
            await roomDoc.update({
              users: {
                ...((await roomDoc.get()).data() as DBRoom).users,
                [this.uId]: {
                  ...((await roomDoc.get()).data() as DBRoom).users[this.uId],
                  LastRead: Date.now(),
                },
              },
            });
          }
        });

      return true;
    } catch (_) {
      return false;
    }
  }

  async onChatEvent(
    func: (arg: FirebaseFirestoreTypes.DocumentData) => any,
    firstActivity: boolean = false,
  ): Promise<boolean> {
    try {
      if (this.ChatEventListener) {
        this.ChatEventListener();
      }
      this.chatFirst = !firstActivity;

      this.ChatEventListener = await firestore()
        .collection(chatPrefix + this.chatId)
        .orderBy('sendAt', 'desc')
        .limit(1)
        .onSnapshot(async querySnapshot => {
          if (this.chatFirst) {
            this.chatFirst = false;
          } else {
            func((await querySnapshot.query.limit(1).get()).docs[0]);
          }
        });

      return true;
    } catch (_) {
      return false;
    }
  }

  async onRoomEvent(
    func: (arg: FirebaseFirestoreTypes.DocumentSnapshot) => any,
    firstActivity: boolean = false,
  ): Promise<boolean> {
    try {
      if (this.RoomEventListener) {
        this.RoomEventListener();
      }
      this.roomFirst = !firstActivity;

      this.RoomEventListener = await firestore()
        .collection(roomCollectionName)
        .doc(this.chatId)
        .onSnapshot(documentSnapshot => {
          if (this.roomFirst) {
            this.roomFirst = false;
          } else {
            func(documentSnapshot);
          }
        });

      return true;
    } catch (_) {
      return false;
    }
  }

  async leave(): Promise<void> {
    this.AppStateEventListener?.remove();
    if (this.ChatInitListener) {
      this.ChatInitListener();
    }
    if (this.ChatEventListener) {
      this.ChatEventListener();
    }
    if (this.RoomEventListener) {
      this.RoomEventListener();
    }
  }

  async getChat(
    sendAt: number = 0,
    limit: number = 80,
    reverse: boolean = false,
  ): Promise<Array<DBChat>> {
    try {
      const chatData = await firestore()
        .collection(chatPrefix + this.chatId)
        .orderBy('sendAt', 'desc')
        .where('sendAt', reverse ? '<' : '>', sendAt)
        .limit(limit)
        .get();

      return chatData.docs.map(s => s.data() as DBChat);
    } catch (_) {
      return [];
    }
  }

  async getRoom(): Promise<{
    status: boolean;
    data?: DBRoom;
  }> {
    try {
      const roomData = await firestore()
        .collection(roomCollectionName)
        .doc(this.chatId)
        .get();

      return {status: true, data: roomData.data() as DBRoom};
    } catch (_) {
      return {status: false};
    }
  }

  async getChatSize(
    sendAt: number = 0,
    limit: number = 80,
  ): Promise<number | boolean> {
    try {
      const chatData = await firestore()
        .collection(chatPrefix + this.chatId)
        .orderBy('sendAt', 'desc')
        .where('sendAt', '>', sendAt)
        .limit(limit)
        .get();

      return chatData.size;
    } catch (_) {
      return false;
    }
  }

  async setNotification(status: boolean): Promise<boolean> {
    try {
      const roomDoc = firestore()
        .collection(roomCollectionName)
        .doc(this.chatId);
      const users: User = ((await roomDoc.get()).data() as DBRoom).users;

      await roomDoc.update({
        users: {
          ...users,
          [this.uId]: {
            ...users[this.uId],
            notification: status,
          },
        },
      });

      return true;
    } catch (_) {
      return false;
    }
  }
  async send(
    type: string,
    message: string,
    uri?: string,
    data?: string,
  ): Promise<boolean> {
    try {
      const date = new Date();
      const chatData: Array<DBChat> | boolean = await this.getChat(0, 1);
      if (!chatData) {
        return false;
      }
      const lastChatDate: Date = new Date(chatData[0].sendAt);

      if (
        date.getFullYear() !== lastChatDate.getFullYear() ||
        date.getMonth() !== lastChatDate.getMonth() ||
        date.getDate() !== lastChatDate.getDate()
      ) {
        await firestore()
          .collection(chatPrefix + this.chatId)
          .doc(String(date.getTime()))
          .set({
            uid: this.uId,
            type: 'date',
            sendAt: date.getTime(),
            message:
              date.getFullYear() +
              '년 ' +
              (date.getMonth() + 1) +
              '월 ' +
              date.getDate() +
              '일 ' +
              week[date.getDay()] +
              '요일',
          });
      }

      await firestore()
        .collection(chatPrefix + this.chatId)
        .doc(String(date.getTime() + 1))
        .set({
          userId: this.uId,
          type,
          message,
          sendAt: date.getTime() + 1,
          uri: uri ?? '',
          data: data ?? '',
        });

      return true;
    } catch (_) {
      return false;
    }
  }

  async uploadImage(uri: string): Promise<string | boolean> {
    try {
      const fileName: string =
        chatPhotoPrefix + '/' + this.chatId + '/' + this.uId + '-' + Date.now();

      await storage()
        .ref(fileName)
        .putFile(
          await Image.compress(uri, {
            compressionMethod: 'auto',
            quality: 0.6,
          }),
        );
      return fileName;
    } catch (_) {
      return false;
    }
  }

  async quit() {
    await this.leave();
    const roomDoc = firestore().collection(roomCollectionName).doc(this.chatId);
    const userData = ((await roomDoc.get()).data() as DBRoom).users;

    delete userData[this.uId];

    await this.send('quit', this.uId + '+님이 방을 나갔습니다.');
    await roomDoc.update({
      users: userData,
    });
  }
}
