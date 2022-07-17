import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { Signer } from 'ethers'
import useWallet from 'hooks/useWallet'
import { CeramicContext, CermaicContextType } from 'contexts/ceramic'
import config from "ceramic-config.json"
import Ceramic, { CeramicClient, CeramicClientConfig } from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";

type Props = {
  children?: React.ReactNode
}
const apiHost = "https://ceramic-clay.3boxlabs.com" || "http://localhost:7007"

const CeramicProvider = ({ children }: Props) => {
  const [ceramic, setCeramic] = useState<CeramicClient>()
  const [idx, setIdx] = useState<IDX>()
  useEffect(() => {
    const _ceramic = new CeramicClient(apiHost)
    //@ts-ignore
    const _idx = new IDX({ ceramic: _ceramic })
    setCeramic(_ceramic)
    setIdx(_idx)
  }, [])
  const [providerState, setProviderState] = useState<CermaicContextType>({
    ceramic,
    idx
  })
  useEffect(() => {
    setProviderState({
      ceramic,
      idx
    })
  }, [ceramic, idx])
  return (
    <CeramicContext.Provider value={providerState}>
      {children}
    </CeramicContext.Provider>
  )
}

export default CeramicProvider