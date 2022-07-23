import { CloseOutlined, HeartFilled, InfoOutlined, StarFilled } from '@ant-design/icons';
import { useWeb3React } from '@web3-react/core';
import { Button } from 'antd';
import Layout from 'components/Layout';
import SwiperCard from 'components/SwiperCard';
import useCeramic from 'hooks/useCeramic';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BsArrowLeftSquare, BsArrowRightSquare, BsArrowUpSquare } from 'react-icons/bs';
import TinderCard from 'react-tinder-card';
import { UserProfile } from 'schema/ceramic/user';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { updateRecommedationList } from 'state/application/reducer';

const characters = [
  {
    walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
    name: "Jessica Lin",
    age: '22',
    avatar: "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    bio: "一堆戴口罩是想表示重視疫情嗎？",
  },
  {
    walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
    name: "Cheasea",
    age: '24',
    avatar: "https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    bio: "上來測試一下Tinder怎麼用"
  },
  {
    walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
    name: "Jessica Sabrina Lin",
    age: '25',
    avatar: "https://images.unsplash.com/photo-1514315384763-ba401779410f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=766&q=80",
    bio: "Not currently looking for love"
  },
  {
    walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
    name: "Cheasea ",
    age: '26',
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    bio: "I am just a boring person"
  },
]

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-top:5vh;
`


const HelperContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:50px;
  position: absolute;
  bottom:2.5vh;
`
const InstructionBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  color:#595959;
`
const StyledButton = styled(Button)`
  background: #595959;
  border-radius: 18px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #FFFFFF;
`

const Recommendation: NextPage = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  // swiper
  const [recommendProfileList, setRecommendProfileList] = useState<UserProfile[]>()
  //--- Justa-2022-07-23
  const { ceramic } = useCeramic();
  const TABLELAND_PREFIX = "https://testnet.tableland.network/query?s=SELECT+description,owner+FROM+tind3r_membership_80001_452+where+"
  //--- end
  const swiperCardRefs = useMemo<any[]>(
    () =>
      Array(recommendProfileList?.length)
        .fill(0)
        .map((i) => createRef()),
    [recommendProfileList]
  )

  //--- Justa-2022-07-23
  const queryUserInfoFromTableland = async (startId: number, endId: number): Promise<string[][]> => {
    const queryURL = TABLELAND_PREFIX + `id>=${startId}+and+id<${endId}`;
    console.log(queryURL)
    const content = await fetch(queryURL)
    const object = await content.json()
    return object.rows
  }

  const getRecProfileList = useCallback(async (): Promise<UserProfile[]> => {
    if (!ceramic) return []
    const userInfoList = await queryUserInfoFromTableland(0, 10)
    console.log(userInfoList)
    // @ts-ignore
    const userInfoMap = new Map<string, string>(userInfoList)
    console.log(userInfoMap)
    const streamIdList = Array(...userInfoMap.keys())
    const queryList = streamIdList.map(sid => { return { streamId: sid } })
    const streamRecord = await ceramic.multiQuery(queryList)
    console.log(streamRecord)
    const recProfileList: UserProfile[] = Object.values(streamRecord).map((stream) => {
      return {
        ...stream.content,
        walletAddress: userInfoMap.get(stream.id.toString())
      }
    })
    const _recommendProfileList = recProfileList.filter((profile) => profile.walletAddress !== account?.toLocaleLowerCase())
    dispatch(updateRecommedationList({ recommendationList: _recommendProfileList }))
    setRecommendProfileList(_recommendProfileList)
    return recProfileList
  }, [ceramic])
  //--- end

  useEffect(() => {
    getRecProfileList()
  }, [ceramic])

  return (
    <Layout>
      {recommendProfileList?.length ? (recommendProfileList.map((userProfile, index) =>
        <SwiperCard key={index} userProfile={userProfile} swiperCardRef={swiperCardRefs[index]} index={index} />
      )) : <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
      <HelperContent>
        <StyledButton>HIDE</StyledButton>
        <InstructionBox><BsArrowLeftSquare />PASS</InstructionBox>
        <InstructionBox><BsArrowUpSquare />SUPERLIKE</InstructionBox>
        <InstructionBox><BsArrowRightSquare />LIKE</InstructionBox>
      </HelperContent>
    </Layout>
  )
}

export default Recommendation
