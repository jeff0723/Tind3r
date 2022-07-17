import type { NextPage } from 'next'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useWallet from '../hooks/useWallet';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import MiniXmtpContext from '../contexts/miniXmtp';
import XmtpContext from '../contexts/xmtp';
import useXmtp from 'hooks/useXmtp';
import useCeramic from 'hooks/useCeramic';

const Home: NextPage = () => {
  const { ceramic, idx, signIn } = useCeramic()
  const {
    connect: connectXmtp,
    disconnect: disconnectXmtp,
    walletAddress,
    client,
  } = useXmtp()
  const router = useRouter()
  const {
    provider,
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
  const [name, setName] = useState('')
  const [userName, setUserName] = useState("")
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

  const handleCeramicSignIn = () => {
    signIn()
  }
  const getProfile = async () => {
    const data = await idx?.get("basicProfile", `${walletAddress}@eip155:1`)
    //@ts-ignore
    if (data) {
      //@ts-ignore
      setUserName(data.name)
    }
  }
  useEffect(() => {
    getProfile()
  }, [walletAddress])


  const handleUpdateData = async () => {

    if (name && idx) {
      if (idx.authenticated) {
        await idx.set('basicProfile', {
          name,
        })
        getProfile()
      } else {
        console.log("not authenticated")
      }

    }
  }
  console.log("xtmp client: ", client)
  console.log("ceramic client: ", ceramic)
  console.log("idx: ", idx)
  console.log("is Authenticated: ", idx?.authenticated)
  console.log("ceramic did:", ceramic?.did)
  console.log("wallet provider: ", provider)



  return (
    <div>
      <h1>{userName ? `Hello ${userName}` : ""}</h1>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect </button>
      <button onClick={handleCeramicSignIn}>Ceramic Sign In</button>
      <input placeholder='name' onChange={(e) => { setName(e.target.value) }}></input>
      <p>{name}</p>
      <button onClick={handleUpdateData}> Update</button>
      <div>You address {walletAddress}</div>
      <div>sign in status: {idx?.authenticated ? "True" : "False"}</div>
    </div>
  )
}

export default Home
