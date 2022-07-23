import React, { useCallback, useEffect, useReducer, useState } from 'react'

import useWallet from 'hooks/useWallet'
import { CeramicContext, CermaicContextType } from 'contexts/ceramic'
import aliases from "schema/ceramic/model.json"
import Ceramic, { CeramicClient, CeramicClientConfig } from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect'
import { DID } from 'dids'
import { getResolver } from '@ceramicnetwork/3id-did-resolver'
import { useWeb3React } from '@web3-react/core';

type Props = {
  children?: React.ReactNode
}
const apiHost = "https://ceramic-clay.3boxlabs.com"

const CeramicProvider = ({ children }: Props) => {
  const { provider, account } = useWeb3React()
  // const { provider, address } = useWallet()
  const [ceramic, setCeramic] = useState<CeramicClient>()
  const [idx, setIdx] = useState<IDX>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const _ceramic = new CeramicClient(apiHost)
    //@ts-ignore
    const _idx = new IDX({ ceramic: _ceramic, aliases: aliases })
    setCeramic(_ceramic)
    setIdx(_idx)
    //@ts-ignore
    window.ceramic = ceramic;
    //@ts-ignore
    window.idx = idx;

  }, [])
  const signIn = useCallback(async () => {
    if (provider && account && ceramic) {
      const threeIdConnect = new ThreeIdConnect()
      const ethProvider = new EthereumAuthProvider(window.ethereum, account)

      await threeIdConnect.connect(ethProvider)
      const did = new DID({
        provider: threeIdConnect.getDidProvider(),
        resolver: {
          ...getResolver(ceramic)
        }
      })

      ceramic.setDID(did)
      await ceramic.did?.authenticate()
      if (idx?.authenticated) {
        setIsAuthenticated(true)
        setIdx(idx)
      }

    }
  }, [provider, account])

  const [providerState, setProviderState] = useState<CermaicContextType>({
    ceramic,
    idx,
    isAuthenticated,
    signIn
  })

  useEffect(() => {
    console.log("check signing in")
    if (provider && account) {
      console.log('signing in')
      signIn()
    }
  }, [account, provider])

  useEffect(() => {
    setProviderState({
      ceramic,
      idx,
      isAuthenticated,
      signIn
    })
  }, [ceramic, idx, signIn, isAuthenticated])


  return (
    <CeramicContext.Provider value={providerState}>
      {children}
    </CeramicContext.Provider>
  )
}

export default CeramicProvider