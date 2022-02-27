import { Vpn } from 'common/typings/Vpn';
import Store from 'electron-store';

export interface IStoreSchema {
  httpUrl: string;
  socketUrl: string;
  isPending: boolean;
  connectionQueue: Vpn;
  disconnectionQueue: Vpn;
  isConnected: boolean;
  connectedVpn: Vpn;
  vpns: Vpn[];
}

const store = new Store<IStoreSchema>({
  defaults: {
    httpUrl: '',
    socketUrl: '',
    isPending: false,
    connectionQueue: {} as Vpn,
    disconnectionQueue: {} as Vpn,
    isConnected: false,
    connectedVpn: {} as Vpn,
    vpns: [],
  },
});

export default store;
