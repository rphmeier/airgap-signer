import React, { useEffect, useState, FormEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import { InjectedExtension, InjectedAccount } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { AssertionError } from 'assert';

const APP_NAME: string = "Airgap-Signer";

function App() {
  const [injected, setInjected] = useState([] as InjectedExtension[]);

  useEffect(() => { web3Enable(APP_NAME).then(i => setInjected(i))}, []);

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
      let onSigningDataChosen = (signingData: Uint8Array) => {

      };

      return <ChooseSigningData account={phase.account} onSigningDataChosen={onSigningDataChosen}/>
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
  const [selectValue, setSelectValue] = useState(-1);

  useEffect(() => {
    web3Accounts().then(accounts => setAccounts(accounts));
  }, []);

  if (accounts.length == 0) {
    return <p>No accounts known</p>
  }

  let accountSelectName = (account: InjectedAccount) => {
    if (account.name) {
      return account.name + " (" + account.address + ") ";
    } else {
      return account.address;
    }
  }

  let accountOptions = accounts.map((account, index) => {
    let s = accountSelectName(account);
    return <option value={index} key={index}>{s}</option>
  });

  let onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(parseInt(event.target.value));
  };

  let onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (selectValue >= accounts.length) {
      return;
    }

    props.onAccountChosen(accounts[0]);
  };

  let disableSubmit = selectValue == -1;
  
  return (
    <div>
      <form onSubmit={onSubmit}>
        <select onChange={onChange}>
          <option value={-1} key="base">--Choose Account--</option>
          {accountOptions}
        </select>
        <input type="submit" value="Submit" disabled={disableSubmit} />
      </form>
    </div>
  )
}

type ChooseDataProps = {
  account: InjectedAccount,
  onSigningDataChosen: (_: Uint8Array) => void,
}

function ChooseSigningData(props: ChooseDataProps) {
  let [signingData, setSigningData] = useState(undefined as Uint8Array | undefined);

  return (
    <div>
      <p>Choose signing data for account {props.account.address}</p>
      
    </div>
  )
}

export default App;