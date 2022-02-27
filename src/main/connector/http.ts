import { Vpn } from 'common/typings/Vpn';

const axios = require('axios').default;

const getVpns = async (url: string): Promise<Vpn[]> => {
  const res = await axios.get(`${url}/vpns`);
  return res as Vpn[];
};

const getAvailableVpn = async (url: string) => {
  const res = await axios.get(`${url}/vpn`);
  return res as Vpn[];
};

const post = async () => {};
