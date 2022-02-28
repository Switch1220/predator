import { Vpn } from 'common/typings/Vpn';
import Store from 'electron-store';

export interface IStoreSchema {
  userInfo: string;
  httpUrl: string;
  socketUrl: string;
  isFull: boolean;
  isPending: boolean;
  connectionQueue: Vpn;
  disconnectionQueue: Vpn;
  isConnected: boolean;
  connectedVpn: Vpn;
  vpns: Vpn[];
}

const store = new Store<IStoreSchema>({
  defaults: {
    userInfo: '',
    httpUrl: '',
    socketUrl: '',
    isFull: true,
    isPending: false,
    connectionQueue: {} as Vpn,
    disconnectionQueue: {} as Vpn,
    isConnected: false,
    connectedVpn: {} as Vpn,
    vpns: [],
  },
});

export default store;
