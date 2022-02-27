import store from '../store';

import { messenger, logger } from '../event-emitter';

import { getAvailableVpn, getVpns, updateVpn } from './httpProvider';

const httpUrl = store.get('httpUrl') || 'http://localhost:3000';

export const updateVpns = async () => {
  try {
    const vpns = await getVpns(httpUrl);
    store.set('vpns', vpns);

    logger.emit('log', 'Http<Get>: Get Vpns');
  } catch (error) {
    throw new Error(`Cannot get vpns: ${error}`);
  }
};

/**
 * Save Vpn fetched into Store
 */
export const registerVpn = async () => {
  try {
    const vpn = await getAvailableVpn(httpUrl);
    store.set('connectionQueue', vpn);

    logger.emit('log', 'Http<Get>: Get Available Vpn');
  } catch (error) {
    // eventEmitter.emit('error', error);
    throw new Error(`Cannot get available vpn: ${error}`);
  }
};

export const confirmVpn = async () => {
  try {
    const vpn = store.get('connectionQueue');
    const res = await updateVpn(httpUrl, vpn);

    store.set('connectedVpn', res);
    store.reset('connectionQueue');

    logger.emit('log', 'Http<Patch>: Update Vpn Info');
  } catch (error) {
    throw new Error(`Cannot update vpn info: ${error}`);
  }
};
