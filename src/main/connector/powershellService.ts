import { PowerShell } from 'node-powershell';

import { messenger, logger } from '../event-emitter';
import store from '../store';

export const connectVpn = async () => {
  const vpn = store.get('connectionQueue');
  if (vpn === null) throw new Error('No Queue');

  const ps = new PowerShell({
    debug: true,
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    },
  });

  try {
    const command = PowerShell.command`
      $vpnName = ${vpn.vpnName}
      $vpnAddress = ${vpn.vpnAddress}
      $vpnUsername = ${vpn.vpnUsername}
      $vpnPassword = ${vpn.vpnPassword}

      $vpn = Get-VpnConnection | where {$_.Name -eq $vpnName}

      if ($vpn -eq $null)
      {
        Add-VpnConnection -Name $vpnName -ServerAddress $vpnAddress
      }

      $cmd = $env:WINDIR + "/System32/rasdial.exe"
      $expression = "$cmd ""$vpnName"" $vpnUsername $vpnPassword"
      Invoke-Expression -Command $expression
    `;

    const result = await ps.invoke(command);
    logger.emit('log', `PowershellService: ${result.command}`);
  } catch (error) {
    throw new Error(`Could not connect via Powershell: ${error}`);
  } finally {
    await ps.dispose();
  }
};

export const disconnectVpn = async () => {
  const vpn = store.get('disconnectionQueue');
  if (vpn === null) throw new Error('No Queue');

  const ps = new PowerShell({
    debug: true,
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    },
  });

  try {
    const command = PowerShell.command`
      $vpnName = ${vpn.vpnName}

      $vpn = Get-VpnConnection -Name $vpnName;

      if($vpn.ConnectionStatus -eq "Connected"){
        rasdial $vpnName /DISCONNECT;
      } else {
        rasdial /DISCONNECT;
      }
    `;

    const result = await ps.invoke(command);
    logger.emit('log', `PowershellService: ${result.command}`);
  } catch (error) {
    throw new Error(`Could not disconnect via Powershell: ${error}`);
  } finally {
    await ps.dispose();
  }
};
