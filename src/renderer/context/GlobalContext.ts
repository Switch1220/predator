import { createContext, useContext } from 'react';
import { Vpn } from 'renderer/types/Vpn';

type VpnContextType = {
  vpns: Vpn[] | null;
  setVpns?: (vpns: Vpn[]) => void;
};

type StatusContextType = {
  isConnected: boolean;
  setIsConnected?: (status: boolean) => void;
  canConnect: boolean;
  setCanConnect: (status: boolean) => void;
};

export const defaultVpnValue: VpnContextType = {
  vpns: null,
};
export const MyVpnContext = createContext<VpnContextType>(defaultVpnValue);
export const useVpnContext = () => useContext(MyVpnContext);

export const defaultStatusValue: StatusContextType = {
  isConnected: false,
  setIsConnected: () => {},
  canConnect: false,
  setCanConnect: () => {},
};
export const MyStatusContext =
  createContext<StatusContextType>(defaultStatusValue);
export const useStatusContext = () => useContext(MyStatusContext);
