import Store, { Schema } from 'electron-store';

export interface IStoreSchema {
  connectedVpn: string;
}

const store = new Store<IStoreSchema>({
  defaults: {
    connectedVpn: '',
  },
});

export default store;
