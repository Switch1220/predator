import { createContext, useContext } from 'react';
import { Vpn } from 'common/typings/Vpn';

type VpnContextType = {
  vpns: Vpn[] | null;
  setVpns?: (vpns: Vpn[]) => void;
};

type StatusContextType = {
  isFull: boolean;
  setIsFull?: (status: boolean) => void;
  isPending: boolean;
  setIsPending?: (status: boolean) => void;
  isConnected: boolean;
  setIsConnected?: (status: boolean) => void;
  isDisabled: boolean;
  setIsDisabled?: (status: boolean) => void;
};

export const defaultVpnValue: VpnContextType = {
  vpns: null,
};
export const MyVpnContext = createContext<VpnContextType>(defaultVpnValue);
export const useVpnContext = () => useContext(MyVpnContext);

export const defaultStatusValue: StatusContextType = {
  isFull: true,
  setIsFull: () => {},
  isPending: false,
  setIsPending: () => {},
  isConnected: false,
  setIsConnected: () => {},
  isDisabled: true,
  setIsDisabled: () => {},
};
export const MyStatusContext =
  createContext<StatusContextType>(defaultStatusValue);
export const useStatusContext = () => useContext(MyStatusContext);
