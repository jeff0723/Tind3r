import type { NextPage } from 'next'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useWallet from '../hooks/useWallet';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import MiniXmtpContext from '../contexts/miniXmtp';
import XmtpContext from '../contexts/xmtp';
import useXmtp from 'hooks/useXmtp';

const Home: NextPage = () => {
  const {
    connect: connectXmtp,
    disconnect: disconnectXmtp,
    walletAddress,
    client,
  } = useXmtp()
  const router = useRouter()
  const {
    signer,
    connect: connectWallet,
    disconnect: disconnectWallet,
  } = useWallet()

  const handleDisconnect = useCallback(async () => {
    disconnectXmtp()
    await disconnectWallet()
    router.push('/')
  }, [disconnectWallet, disconnectXmtp, router])

  const handleConnect = useCallback(async () => {
    await connectWallet()
  }, [connectWallet])

  const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T>()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const prevSigner = usePrevious(signer)

  useEffect(() => {
    // if (!signer && prevSigner) {
    //   disconnectXmtp()
    // }
    if (!signer || signer === prevSigner) return
    const connect = async () => {
      const prevAddress = await prevSigner?.getAddress()
      const address = await signer.getAddress()
      if (address === prevAddress) return
      connectXmtp(signer)
    }
    connect()
  }, [signer, prevSigner, connectXmtp, disconnectXmtp])
  console.log("xtmp client: ", client)
  return (
    <div>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect </button>
      <div>You address {walletAddress}</div>
    </div>
  )
}

export default Home
