import React, { useCallback, useEffect, useReducer, useState, FunctionComponent, useRef } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { XmtpContext, XmtpContextType } from 'contexts/xmtp'
import useMessageStore from 'hooks/useMessageStore'
import useCeramic from 'hooks/useCeramic'
import { useWeb3React } from '@web3-react/core'

function usePreviousString(value: string | undefined) {
  const ref = useRef<string | undefined>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export const XmtpProvider: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated } = useCeramic()
  const { provider, account } = useWeb3React()
  const [client, setClient] = useState<Client>()
  const prevClientAddress = usePreviousString(client?.address);

  const getXmtp = useCallback(async () => {
    if (isAuthenticated && provider && account) {
      const client = await Client.create(provider.getSigner())
      setClient(client)
    }
  }, [isAuthenticated, provider, account])
  const listConversations = useCallback(async () => {
    if (!client) return
    console.log('Listing conversations')
    // setLoadingConversations(true)
    const convos = await client.conversations.list()
    convos.forEach((convo: Conversation) => {
      // dispatchConversations([convo])
      console.log('Conversation:', convo)
    })
  }, [[client]])

  const streamConversations = useCallback(async () => {
    if (!client) return
    const stream = await client.conversations.stream()
    for await (const convo of stream) {
      console.log('Conversation stream', convo)
    }
  }, [client])
  useEffect(() => {
    getXmtp()
  }, [provider, account, isAuthenticated])

  useEffect(() => {

    listConversations()
    streamConversations()

  }, [client])

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
