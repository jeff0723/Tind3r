import type { NextPage } from 'next'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useWallet from '../hooks/useWallet';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import MiniXmtpContext from '../contexts/miniXmtp';
import XmtpContext from '../contexts/xmtp';
import useXmtp from 'hooks/useXmtp';
import useCeramic from 'hooks/useCeramic';
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { updateUserName } from 'state/user/reducer';
import Layout from '../components/Layout'

const Home: NextPage = () => {
  const dispatch = useAppDispatch()
  const appUserName = useAppSelector((state) => state.user.userName)
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
    address,
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
    await idx?.get("basicProfile", `${address}@eip155:1`)
      .then(res => {
        console.log("getProfile: ", res)
        //@ts-ignore
        setUserName(res.name)
        //@ts-ignore
        dispatch(updateUserName({ userName: res.name }))
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    getProfile()
  }, [address])


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
  console.log(address)
  console.log("App user name: ", appUserName)

  return (
    <Layout>
      <h1>{userName ? `Hello ${userName}` : ""}</h1>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect </button>
      <button onClick={handleCeramicSignIn}>Ceramic Sign In</button>
      <input placeholder='name' onChange={(e) => { setName(e.target.value) }}></input>
      <p>{name}</p>
      <button onClick={handleUpdateData}> Update</button>
      <div>You address {address}</div>
      <div>sign in status: {idx?.authenticated ? "True" : "False"}</div>
    </Layout>
  )
}

export default Home
