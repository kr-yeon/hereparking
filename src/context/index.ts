import {createContext} from 'react';

interface GlobalDataInterface {
  uid: string;
  setUid: Function;
  network: boolean;
  showNetworkAlert: Function;
  setChatScreen: Function;
}

export const GlobalData = createContext<GlobalDataInterface>({
  uid: '',
  setUid: () => {},
  network: true,
  showNetworkAlert: () => {},
  setChatScreen: () => {},
});
