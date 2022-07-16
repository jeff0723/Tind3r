import { Client } from '@xmtp/xmtp-js'
import { createContext } from 'react'
export type MiniXmtpContextType = {
    client: Client | undefined
}

export const MiniXmtpContext = createContext<MiniXmtpContextType>({
    client: undefined,
})

export default MiniXmtpContext