import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

interface initInfo {
  nick: string;
  car_number: string;
  car_name: string;
  image_uri: string;
  phone_number: string;
}

interface editInfo {
  nick: string;
  car_number: string;
  car_name: string;
  image_uri: string;
}

interface duplicateInfo {
  status: boolean;
  info?: boolean;
}

interface writingReturn {
  status: boolean;
  doc_id?: string;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

export interface INotificationList {
  title: string;
  res: string;
  time: number;
}

export interface UserInfo {
  nick_name: string;
  phone_number: string;
  writing_list: Array<string>;
  car_number: string;
  car_name: string;
  profile_image: string;
  notification: boolean;
  rank_point: string;
  notification_list: Array<INotificationList>;
  token_list: Array<string>;
  chat_list: Array<string>;
}

export interface WritingInfo {
  uid: string;
  location: ILocation;
  address: {
    address: string;
    detail_address: string;
  };
  images: Array<string>;
  start_time: string;
  end_time: string;
  upload_time: number;
  reservation: boolean;
}

export interface WritingInfoId extends WritingInfo {
  id: string;
}

export interface WithTimeReturn {
  status: boolean;
  data?: Array<WritingInfo>;
}

export interface GetWriting {
  status: boolean;
  data?: WritingInfo;
}

export async function duplicate_check(uid: string): Promise<boolean> {
  const finding = await firestore().collection('users').doc(uid).get();

  return finding.exists;
}

export async function nick_duplicate_check(
  nick: string,
): Promise<duplicateInfo> {
  try {
    const finding = await firestore()
      .collection('users')
      .where('nick_name', '==', nick)
      .limit(1)
      .get();

    return {status: true, info: !finding.empty};
  } catch (_) {
    return {status: false};
  }
}

export async function initData(uid: string, info: initInfo): Promise<boolean> {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .set({
        nick_name: info.nick,
        phone_number: info.phone_number,
        writing_list: [],
        car_number: info.car_number,
        car_name: info.car_name,
        profile_image: info.image_uri,
        notification: true,
        rank_point: '-',
        notification_list: [],
        token_list: [await messaging().getToken()],
        chat_list: [],
      });
    return true;
  } catch (_) {
    return false;
  }
}

export async function editPhoneNumber(
  uid: string,
  phone_number: string,
): Promise<boolean> {
  try {
    await firestore().collection('users').doc(uid).update({
      phone_number,
    });
    return true;
  } catch (_) {
    return false;
  }
}

export async function delTokenList(uid: string) {
  try {
    const user = await get_user(uid);
    const token: string = await messaging().getToken();

    if (user.status) {
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          token_list: user.data!.token_list.filter(s => s !== token),
        });
    } else {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

export async function addTokenList(uid: string) {
  try {
    const user = await get_user(uid);

    if (user.status) {
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          token_list: [
            ...new Set([
              ...user.data!.token_list,
              await messaging().getToken(),
            ]),
          ],
        });
    } else {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

export async function delChatList(uid: string, key: string) {
  try {
    const user = await get_user(uid);

    if (user.status) {
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          chat_list: user.data!.chat_list.filter(s => s !== key),
        });
    } else {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

export async function addChatList(uid: string, key: string) {
  try {
    const user = await get_user(uid);

    if (user.status) {
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          chat_list: [...user.data!.chat_list, key],
        });
    } else {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

export async function addNotification(uid: string, config: INotificationList) {
  try {
    const user = await get_user(uid);

    if (user.status) {
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          notification_list: [...user.data!.notification_list, config],
        });
    } else {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

export async function getNotification(
  uid: string,
): Promise<boolean | Array<INotificationList>> {
  try {
    const user = await get_user(uid);

    if (user.status) {
      return (
        (
          await firestore().collection('users').doc(uid).get()
        ).data() as UserInfo
      ).notification_list;
    } else {
      return false;
    }
  } catch (_) {
    return false;
  }
}

export async function editData(uid: string, info: editInfo): Promise<boolean> {
  try {
    await firestore().collection('users').doc(uid).update({
      nick_name: info.nick,
      car_number: info.car_number,
      car_name: info.car_name,
      profile_image: info.image_uri,
    });
    return true;
  } catch (_) {
    return false;
  }
}

export async function writing(
  uid: string,
  location: ILocation,
  address: string,
  detail_address: string,
  image_length: number,
  start_time: string,
  end_time: string,
): Promise<writingReturn> {
  try {
    const writings_doc = firestore().collection('writings').doc();
    const user_doc = firestore().collection('users').doc(uid);

    await user_doc.update({
      writing_list: [
        writings_doc.id,
        ...((await user_doc.get()).data() as UserInfo).writing_list,
      ],
    });
    await writings_doc.set({
      uid,
      location,
      address: {
        address,
        detail_address,
      },
      images: [...Array(image_length).keys()].map(
        s =>
          'https://firebasestorage.googleapis.com/v0/b/hereparking-7c86f.appspot.com/o/writings%2F' +
          writings_doc.id +
          '%2F' +
          s +
          '?alt=media',
      ),
      start_time,
      end_time,
      upload_time: Date.now(),
      reservation: false,
    });

    return {status: true, doc_id: writings_doc.id};
  } catch (e) {
    return {status: false};
  }
}

export async function edit(
  id: string,
  uid: string,
  location: ILocation,
  address: string,
  detail_address: string,
  image_length: number,
  start_time: string,
  end_time: string,
): Promise<writingReturn> {
  try {
    const writings_doc = firestore().collection('writings').doc(id);

    await writings_doc.set({
      uid,
      location,
      address: {
        address,
        detail_address,
      },
      images: [...Array(image_length).keys()].map(
        s =>
          'https://firebasestorage.googleapis.com/v0/b/hereparking-7c86f.appspot.com/o/writings%2F' +
          writings_doc.id +
          '%2F' +
          s +
          '?alt=media',
      ),
      start_time,
      end_time,
      upload_time: Date.now(),
      reservation: false,
    });

    return {status: true, doc_id: writings_doc.id};
  } catch (e) {
    return {status: false};
  }
}

export async function get_writings(): Promise<{
  status: boolean;
  data?: Array<WritingInfoId>;
}> {
  try {
    const data: Array<WritingInfoId> = [];

    (
      await firestore()
        .collection('writings')
        .orderBy('upload_time', 'desc')
        .limit(10)
        .get()
    ).forEach(s => {
      data.push({...(s.data() as WritingInfo), id: s.id});
    });

    return {status: true, data};
  } catch (e) {
    return {status: false};
  }
}

export async function get_writings_with_time(
  upload_time: number,
): Promise<WithTimeReturn> {
  try {
    const data: Array<WritingInfoId> = [];

    (
      await firestore()
        .collection('writings')
        .orderBy('upload_time', 'desc')
        .startAfter(upload_time)
        .limit(10)
        .get()
    ).forEach(s => {
      data.push({...(s.data() as WritingInfo), id: s.id});
    });

    if (data.length === 0) {
      return {status: false};
    }
    return {status: true, data: data};
  } catch (e) {
    return {status: false};
  }
}

export async function get_writing(id: string): Promise<GetWriting> {
  try {
    return {
      status: true,
      data: (
        await firestore().collection('writings').doc(id).get()
      ).data() as WritingInfo,
    };
  } catch (e) {
    return {status: false};
  }
}

export async function del_writing(uId: string, id: string): Promise<boolean> {
  try {
    const userDoc = firestore().collection('users').doc(uId);
    await userDoc.update({
      writing_list: (
        (await userDoc.get()).data() as UserInfo
      ).writing_list.filter(s => s !== id),
    });
    await firestore().collection('writings').doc(id).delete();
    return true;
  } catch (e) {
    return false;
  }
}

export async function get_user(
  uId: string,
): Promise<{status: boolean; data?: UserInfo}> {
  try {
    return {
      status: true,
      data: (
        await firestore().collection('users').doc(uId).get()
      ).data() as UserInfo,
    };
  } catch (e) {
    return {status: false};
  }
}

export async function set_reservation(id: string, value: boolean) {
  try {
    await firestore().collection('writings').doc(id).update({
      reservation: value,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function set_notification(uid: string, value: boolean) {
  try {
    await firestore().collection('users').doc(uid).update({
      notification: value,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function secession(uId: string) {
  try {
    await firestore().collection('users').doc(uId).delete();
    return true;
  } catch (e) {
    return false;
  }
}

export async function get_map_info(): Promise<Array<WritingInfoId> | boolean> {
  try {
    const returnData: Array<WritingInfoId> = [];
    const writings = await firestore().collection('writings').get();

    writings.forEach(s => {
      returnData.push({...s.data(), id: s.id} as WritingInfoId);
    });

    return returnData;
  } catch (e) {
    return false;
  }
}
