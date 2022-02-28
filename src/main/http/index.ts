import store from '../store';

import { messenger, logger } from '../event-emitter';

import {
  getAvailableVpn,
  getVpns,
  ping,
  registerConnection,
  registerDisconnection,
} from './httpProvider';

const httpUrl = store.get('httpUrl') || 'http://localhost:3000';

export const checkHealth = async () => {
  try {
    const status = await ping(httpUrl);
    if (status !== 200) throw new Error('Cannot connect to the server');
  } catch (error) {
    throw new Error(`Cannot connect to the server: ${error}`);
  }
};

export const updateVpns = async () => {
  try {
    const vpns = await getVpns(httpUrl);
    store.set('vpns', vpns);

    const hasAvailableVpn = vpns.some((vpn) => {
      return vpn.isAvailable === true;
    });
    store.set('isFull', !hasAvailableVpn);

    messenger.emit('update');

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

export const confirmConnectedVpn = async () => {
  try {
    const id = store.get('connectionQueue.id') as string;
    const userInfo = store.get('userInfo');

    const res = await registerConnection(httpUrl, { id, userInfo });

    store.set('connectedVpn', res);
    store.reset('connectionQueue');

    logger.emit('log', 'Http<Patch>: Update Vpn Info');
  } catch (error) {
    throw new Error(`Cannot update vpn info: ${error}`);
  }
};

export const queueToDisconnect = async () => {
  const connectedVpn = store.get('connectedVpn');
  store.set('disconnectionQueue', connectedVpn);
  store.reset('connectedVpn');
};

export const confirmDisconnectedVpn = async () => {
  try {
    const id = store.get('disconnectionQueue.id') as string;

    await registerDisconnection(httpUrl, { id });

    store.reset('disconnectionQueue');

    logger.emit('log', 'Http<Patch>: Update Vpn Info');
  } catch (error) {
    throw new Error(`Cannot update vpn info: ${error}`);
  }
};
