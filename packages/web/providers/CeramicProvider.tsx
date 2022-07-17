import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { Signer } from 'ethers'
import useWallet from 'hooks/useWallet'
import { CeramicContext, CermaicContextType } from 'contexts/ceramic'
import config from "ceramic-config.json"

type Props = {
  children?: React.ReactNode
}

const CeramicProvider = ({ children }: Props) => {
  const [client, setClient] = useState()

  const [providerState, setProviderState] = useState<CermaicContextType>({
    client,
  })
  return (
    <CeramicContext.Provider value={providerState}>
      {children}
    </CeramicContext.Provider>
  )
}

export default CeramicContext