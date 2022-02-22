import { PowerShell } from 'node-powershell';
import { Vpn } from 'renderer/types/Vpn';

export const connectVpn = async (res: Vpn) => {
  const vpn = res;

  const ps = new PowerShell({
    debug: true,
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    },
  });

  try {
    const simpleCommand = PowerShell.command`
      $vpnname = ${vpn.vpnName}
      $vpnaddress = ${vpn.vpnAddress}
      $vpnusername = ${vpn.vpnUsername}
      $vpnpassword = ${vpn.vpnPassword}

      $vpn = Get-VpnConnection | where {$_.Name -eq $vpnname}

      if ($vpn -eq $null)
      {
        Add-VpnConnection -Name $vpnname -ServerAddress $vpnaddress
      }

      $cmd = $env:WINDIR + "/System32/rasdial.exe"
      $expression = "$cmd ""$vpnname"" $vpnusername $vpnpassword"
      Invoke-Expression -Command $expression
    `;

    await ps.invoke(simpleCommand);
  } catch (e) {
    console.log(e);
  } finally {
    await ps.dispose();
  }
};

export const disconnectVpn = async (res: Vpn) => {
  const vpn = res;

  const ps = new PowerShell({
    debug: true,
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    },
  });

  try {
    const simpleCommand = PowerShell.command`
      $vpnname = ${vpn.vpnName}

      $vpn = Get-VpnConnection -Name $vpnname;

      if($vpn.ConnectionStatus -eq "Connected"){
        rasdial $vpnName /DISCONNECT;
      }
    `;

    await ps.invoke(simpleCommand);
  } catch (e) {
    console.log(e);
  } finally {
    await ps.dispose();
  }
};
