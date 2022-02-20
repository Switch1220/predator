export {};

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => unknown;
        set: (key: string, val: unknown) => void;
      };
      ipcRenderer: {
        connectReq: () => void;
        disconnectReq: () => void;
        vpnReq: () => void;
        send: (channel: string, args: unknown[]) => void;
        on: (channel: string, func: (args: unknown[]) => void) => void;
        once: (channel: string, func: (args: unknown[]) => void) => void;
      };
    };
  }
}
