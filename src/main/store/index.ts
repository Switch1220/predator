import { Vpn } from 'common/typings/Vpn';
import Store from 'electron-store';

export interface IStoreSchema {
  httpUrl: string;
  socketUrl: string;
  connectedVpn: string;
  vpns: Vpn[];
}

const store = new Store<IStoreSchema>({
  defaults: {
    httpUrl: '',
    socketUrl: '',
    connectedVpn: '',
    vpns: [],
  },
});

export default store;
