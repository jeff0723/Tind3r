import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { MiniXmtpContext, MiniXmtpContextType } from '../contexts/miniXmtp'

type Props = {
    children?: React.ReactNode
}

const MiniXtmpProvider = ({ children }: Props) => {
    const [wallet, setWallet] = useState<Signer>()
    const [walletAddress, setWalletAddress] = useState<string>()
    const [client, setClient] = useState<Client>()
    useEffect(() => {
        const initClient = async () => {
            if (!wallet) {
                console.log("Haven't collect wallet yet!")
                return
            }
            setClient(await Client.create(wallet))
        }
        initClient()
    }, [wallet])
    const [providerState, setProviderState] = useState<MiniXmtpContextType>({
        client,
    })
    return (
        <MiniXmtpContext.Provider value={providerState}>
            {children}
        </MiniXmtpContext.Provider>
    )
}

export default MiniXtmpProvider