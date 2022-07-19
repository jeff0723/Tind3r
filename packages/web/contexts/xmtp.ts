import { createContext, Dispatch } from 'react'
import { Client, Message } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { Conversation } from '@xmtp/xmtp-js/dist/types/src/conversations'

export type MessageStoreEvent = {
  peerAddress: string
  messages: Message[]
}

export type XmtpContextType = {

  client: Client | undefined

}

export const XmtpContext = createContext<XmtpContextType>({

  client: undefined,

})

export default XmtpContext
