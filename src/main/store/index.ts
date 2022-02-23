import Store, { Schema } from 'electron-store';

interface IStoreSchema {
  socket: string;
}

const store = new Store<IStoreSchema>({
  defaults: {
    socket: 'j',
  },
});

export default store;
