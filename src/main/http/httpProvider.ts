import { Vpn } from 'common/typings/Vpn';

const axios = require('axios').default;

export const getVpns = async (url: string): Promise<Vpn[]> => {
  const res = await axios.get(`${url}/vpns`);
  return res as Promise<Vpn[]>;
};

export const getAvailableVpn = async (url: string) => {
  const res = await axios.get(`${url}/vpn`);
  return res as Promise<Vpn>;
};
