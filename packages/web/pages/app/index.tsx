import { useWeb3React } from '@web3-react/core';
import Layout from 'components/Layout';
import { injectedConnection } from 'connection';
import useCeramic from 'hooks/useCeramic';
import useXmtp from 'hooks/useXmtp';
import type { NextPage } from 'next';
import { useEffect, useState, useRef, createRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { updateIsProfileExists, updateUserName } from 'state/user/reducer';
import { BasicProfile } from 'schema/ceramic/user';
import TinderCard from 'react-tinder-card';
import styled from 'styled-components';

const characters = [
    {
        name: 'Richard Hendricks',
        url: './img/richard.jpg'
    },
    {
        name: 'Erlich Bachman',
        url: './img/erlich.jpg'
    },
    {
        name: 'Monica Hall',
        url: './img/monica.jpg'
    },
    {
        name: 'Jared Dunn',
        url: './img/jared.jpg'
    },
    {
        name: 'Dinesh Chugtai',
        url: './img/dinesh.jpg'
    }
]

const CardContainer = styled.div`
  width: 400px;
  height: 300px;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
`

const Card = styled.div`
  position: relative;
  width: 260px;
  height: 300px;
  border-radius: 20px;
  padding: 30px;
  background-color: #fff;
`

const Home: NextPage = () => {
    const { account, chainId } = useWeb3React()
    const { client } = useXmtp()
    const { idx, isAuthenticated } = useCeramic()
    const [name, setName] = useState("")

    // swiper
    const [currentIndex, setCurrentIndex] = useState(characters.length - 1)
    const [lastDirection, setLastDirection] = useState("")
    const currentIndexRef = useRef(currentIndex)
    const canSwipe = currentIndex >= 0
    const childRefs = useMemo<any[]>(
        () =>
            Array(characters.length)
                .fill(0)
                .map((i) => createRef()),
        []
    )

    const dispatch = useAppDispatch()
    const userName = useAppSelector(state => state.user.userName)
    const userProfile = useAppSelector(state => state.user.userProfile)
    const handleConnect = async () => {
        console.log('connect clicked')

        await injectedConnection.connector.activate()
    }


    const getProfile = async () => {
        if (idx && account && isAuthenticated) {
            const res = await idx.get("basicProfile", `${account}@eip155:${chainId}`) as BasicProfile
            if (res) {
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
    console.log("User Profile:", userProfile)

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
