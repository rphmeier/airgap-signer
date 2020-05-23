import React, { useEffect, useState } from 'react';
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

enum AppPhaseKind {
  ChooseAccount,
  ChooseSigningData,
  ViewSigned,
}

type PhaseChooseAccount = {
  phase: AppPhaseKind.ChooseAccount,
}

type PhaseChooseSigningData = {
  phase: AppPhaseKind.ChooseSigningData,
  account: InjectedAccount,
}
type PhaseViewSigned = {
  phase: AppPhaseKind.ViewSigned,
  account: InjectedAccount,
  signed: Uint8Array,
  signature: Uint8Array,
}

type AppPhase = PhaseChooseAccount | PhaseChooseSigningData | PhaseViewSigned;

function InitializedApp() {
  let [phase, setPhase] = useState({ phase: AppPhaseKind.ChooseAccount } as AppPhase);

  switch (phase.phase) {
    case AppPhaseKind.ChooseAccount: {
      let onAccountChosen = (account: InjectedAccount) => {
        setPhase({
          phase: AppPhaseKind.ChooseSigningData,
          account: account,
        });
      }
      return <ChooseAccount onAccountChosen={onAccountChosen} />
    }
    case AppPhaseKind.ChooseSigningData: {
      return <p>Choose signing data</p>
    }
    case AppPhaseKind.ViewSigned: {
      return <p>View signature</p>
    }
    default: throw new Error("Fatal error: entered unknown state")
  }
}

type ChooseAccountProps = {
  onAccountChosen: (account: InjectedAccount) => void,
}

function ChooseAccount(props: ChooseAccountProps) {
  const [accounts, setAccounts] = useState([] as InjectedAccount[]);

  useEffect(() => {
    web3Accounts().then(accounts => setAccounts(accounts));
  }, [accounts]);

  if (accounts.length == 0) {
    return <p>No accounts known</p>
  }

  let chooseFirstAccount = () => {
    props.onAccountChosen(accounts[0]);
  }
  
  return (
    <div>
      <p>Press to choose an account:</p>
      <button onClick={chooseFirstAccount}>Choose</button>
    </div>
  )
}

export default App;