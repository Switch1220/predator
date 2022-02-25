import task from 'main/event';

import { Vpn } from 'common/typings/Vpn';
import store from 'main/store';

import { getAvailableVpn } from './httpProvider';

const httpUrl = (store.get('httpUrl') as string) ?? 'http://192.168.0.161:3000';

task.on('get-vpn', async () => {
  try {
    const vpn: Vpn = await getAvailableVpn(httpUrl);

    store.set('connectedVpn', vpn);

    task.emit('connect');
  } catch (error) {
    task.emit('error', error);
  }
});
