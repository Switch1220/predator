import { Vpn } from 'common/typings/Vpn';

const axios = require('axios').default;

export const ping = async (url: string) => {
  const res = await axios.get(`${url}/ping`);
  return res.status;
};

export const getVpns = async (url: string): Promise<Vpn[]> => {
  const res = await axios.get(`${url}/vpns`);
  return res.data as Promise<Vpn[]>;
};

export const getAvailableVpn = async (url: string): Promise<Vpn> => {
  const res = await axios.get(`${url}/vpn`);
  return res.data as Promise<Vpn>;
};

export const registerConnection = async (
  url: string,
  data: { id: string; userInfo: string }
): Promise<Vpn> => {
  const res = await axios.patch(`${url}/vpn/connect`, data);
  return res.data as Promise<Vpn>;
};

export const registerDisconnection = async (
  url: string,
  data: { id: string }
): Promise<Vpn> => {
  const res = await axios.patch(`${url}/vpn/disconnect`, data);
  return res.data as Promise<Vpn>;
};
