import React, { useCallback, useEffect, useReducer, useState, FunctionComponent } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { XmtpContext, XmtpContextType } from '../contexts/xmtp'
import useMessageStore from '../hooks/useMessageStore'
import useCeramic from 'hooks/useCeramic'
import { useWeb3React } from '@web3-react/core'

export const XmtpProvider: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated } = useCeramic()
  const { provider, account } = useWeb3React()
  const [client, setClient] = useState<Client>()
  useEffect(() => {
    const getXmtp = async () => {
      if (isAuthenticated && provider && account) {
        const client = await Client.create(provider.getSigner())
        setClient(client)
      }
    }
    getXmtp()
  }, [provider, account, isAuthenticated])









  const [providerState, setProviderState] = useState<XmtpContextType>({

    client,

  })

  useEffect(() => {
    setProviderState({

      client,

    })
  }, [

    client,

  ])

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  )
}

export default XmtpProvider
