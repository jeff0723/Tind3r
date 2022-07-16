import type { NextPage } from 'next'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useWallet from '../hooks/useWallet';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import MiniXmtpContext from '../contexts/miniXmtp';
import XmtpContext from '../contexts/xmtp';

const Home: NextPage = () => {
  const xtmpClient = useContext(XmtpContext)

  const router = useRouter()
  const {
    signer,
    address,
    connect: connectWallet,
    disconnect: disconnectWallet,
  } = useWallet()


  const handleDisconnect = useCallback(async () => {

    await disconnectWallet()
    router.push('/')
  }, [disconnectWallet, router])

  const handleConnect = useCallback(async () => {
    await connectWallet()
  }, [connectWallet])
  console.log("xtmpClient:", xtmpClient)
  return (
    <div>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect </button>
      <div>You address {address}</div>
    </div>
  )
}

export default Home
