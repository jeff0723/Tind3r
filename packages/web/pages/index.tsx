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
import { updateUserName, updateIsProfileExists } from 'state/user/reducer';
import { useWeb3React } from '@web3-react/core';
import { injectedConnection } from 'connection';
import { Signer } from 'ethers';
import { Client } from '@xmtp/xmtp-js'
import { is } from 'immer/dist/internal';

const Home: NextPage = () => {
  const { account } = useWeb3React()
  const { client } = useXmtp()
  const { idx, isAuthenticated } = useCeramic()
  const [name, setName] = useState("")
  const dispatch = useAppDispatch()
  const userName = useAppSelector(state => state.user.userName)

  const handleConnect = async () => {
    console.log('connect clicked')

    await injectedConnection.connector.activate()
  }

  const getProfile = async () => {
    if (idx && account && isAuthenticated) {
      const res = await idx.get("basicProfile", `${account}@eip155:1`)
      console.log(res)
      //@ts-ignore
      if (res) {
        dispatch(updateIsProfileExists(true))
        //@ts-ignore)
        dispatch(updateUserName({ userName: res.name }))
      }
    }
  }
  useEffect(() => {
    getProfile()
  }, [idx, account, isAuthenticated])

  const handleUpdateName = async () => {
    console.log('button clicked')
    console.log(name)
    if (!name || !isAuthenticated || !idx || !idx.authenticated) return
    console.log('start to update')
    const res = await idx?.set("basicProfile", { name })

    console.log("respones", res)
    getProfile()

  }
  console.log(idx?.authenticated)
  return (
    <div>

      <button onClick={handleConnect}>Connect</button>
      <h1>Hello: {userName}</h1>
      <h1>Status:{account ? "connected" : "not connected"}</h1>
      <h1>Address:{account}</h1>
      <h1>XTMP Client : {client ? "connected" : "not connected"}</h1>
      <h1>Ceramic Connect:{idx?.authenticated ? "True" : "False"}</h1>
      <input placeholder='update your name' onChange={(e) => setName(e.target.value)}></input>
      <button onClick={handleUpdateName}>Update</button>
    </div>
  )
}

export default Home
