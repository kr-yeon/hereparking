import auth from '@react-native-firebase/auth';

export interface defaultReturn {
  type: boolean;
  data?: any;
}

export async function signInWithPhoneNumber(
  phoneNumber: string,
): Promise<defaultReturn> {
  try {
    const formatPhoneNumber =
      phoneNumber.slice(1, 3) +
      '-' +
      phoneNumber.slice(3, 7) +
      '-' +
      phoneNumber.slice(7);
    return {
      type: true,
      data: await auth().signInWithPhoneNumber(
        '+82 ' + formatPhoneNumber,
        true,
      ),
    };
  } catch (e) {
    return {type: false};
  }
}

export async function confirm(
  confirmation: any,
  code: string,
): Promise<defaultReturn> {
  try {
    return {type: true, data: await confirmation.confirm(code)};
  } catch (e) {
    return {type: false};
  }
}

export async function signOut() {
  try {
    await auth().signOut();
  } catch (e) {}
}
