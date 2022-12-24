import storage from '@react-native-firebase/storage';
import {Image} from 'react-native-compressor';

export async function uploadImage(uid: string, uri: string): Promise<boolean> {
  try {
    if (uri.startsWith('file://')) {
      await storage()
        .ref('users/' + uid)
        .putFile(
          await Image.compress(uri, {
            compressionMethod: 'auto',
            quality: 1,
          }),
        );
    }
    return true;
  } catch (_) {
    return false;
  }
}

export async function uploadMultiImage(
  folder_name: string,
  image_list: Array<string>,
): Promise<boolean> {
  try {
    const files = [];

    for (const i in image_list) {
      if (image_list[i].startsWith('file://')) {
        files.push({
          ref: 'writings/' + folder_name + '/' + i,
          file: await Image.compress(image_list[i], {
            compressionMethod: 'auto',
            quality: 1,
          }),
        });
      } else {
        await storage()
          .ref('writings/' + folder_name + '/' + i)
          .put(await (await fetch(image_list[i])).blob());
      }
    }

    for (const s of files) {
      await storage().ref(s.ref).putFile(s.file);
    }

    return true;
  } catch (_) {
    return false;
  }
}

export async function del_user_image(uId: string) {
  try {
    await storage()
      .ref('users/' + uId)
      .delete();
    return true;
  } catch (_) {
    return false;
  }
}

export async function del_image(id: string) {
  try {
    const list = await storage()
      .ref('writings/' + id + '/')
      .listAll();
    list.items.map(s => s.delete());
    return true;
  } catch (_) {
    return false;
  }
}
