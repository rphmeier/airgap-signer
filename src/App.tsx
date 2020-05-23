import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import logo from './logo.svg';
import './App.css';
import { InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

const APP_NAME: string = "Airgap-Signer";

function App() {
  const [injected, setInjected] = useState([] as InjectedExtension[]);

  useEffect(() => { web3Enable(APP_NAME).then(i => setInjected(i))}, [injected]);

  if (injected.length == 0) {
    return <p>No injected signers, initializing?</p>
  } else {
    return <InitializedApp />
  }
}

// The signing process takes on these phases:
// 1. Choose account / network
// 2. Choose signing data (QR / Hex)
// 3. Sign!
// 4. View signature as hex or QR code.

function InitializedApp() {
  return <p>Wahoo!</p>;
}

export default App;