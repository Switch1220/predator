import { Vpn } from 'common/typings/Vpn';

const axios = require('axios').default;

export const getVpns = async (url: string): Promise<Vpn[]> => {
  const res = await axios.get(`${url}/vpns`);
  return res.data as Promise<Vpn[]>;
};

export const getAvailableVpn = async (url: string): Promise<Vpn> => {
  const res = await axios.get(`${url}/vpn`);
  return res.data as Promise<Vpn>;
};

export const updateVpn = async (url: string, data: Vpn): Promise<Vpn> => {
  const res = await axios.patch(url, data);
  return res.data as Promise<Vpn>;
};
