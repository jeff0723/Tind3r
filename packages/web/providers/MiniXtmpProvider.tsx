import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { Conversation } from '@xmtp/xmtp-js'
import { Client } from '@xmtp/xmtp-js'
import { Signer } from 'ethers'
import { MiniXmtpContext, MiniXmtpContextType } from '../contexts/miniXmtp'
import useWallet from 'hooks/useWallet'

type Props = {
    children?: React.ReactNode
}

const MiniXtmpProvider = ({ children }: Props) => {
    const { signer } = useWallet()
    const [wallet, setWallet] = useState<Signer>()
    const [walletAddress, setWalletAddress] = useState<string>()
    const [client, setClient] = useState<Client>()
    useEffect(() => {
        const initClient = async () => {
            if (!wallet) {
                console.log("Haven't collect wallet yet!")
                return
            }
            console.log("Wallet collected, init client")
            setClient(await Client.create(wallet))
        }
        initClient()
    }, [wallet])
    useEffect(() => {
        if (signer) {
            setWallet(signer)
        }
    }, [signer])

    const [providerState, setProviderState] = useState<MiniXmtpContextType>({
        client,
    })
    useEffect(() => {
        setProviderState({ client })
    }, [client])
    console.log('client: ', client)
    return (
        <MiniXmtpContext.Provider value={providerState}>
            {children}
        </MiniXmtpContext.Provider>
    )
}

export default MiniXtmpProvider