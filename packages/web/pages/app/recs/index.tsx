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
import { Button, Card } from 'antd';
import { CloseOutlined, HeartFilled, InfoOutlined, StarFilled } from '@ant-design/icons';
import { BsArrowLeftSquare, BsArrowRightSquare, BsArrowUpSquare } from 'react-icons/bs'
import { useRouter } from 'next/router';

const { Meta } = Card;

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
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 375px;
  border-radius: 16px;
`

const CardContent = styled.div<({ image: string }) >`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 566px;
  background: linear-gradient(180.03deg, rgba(0, 0, 0, 0) 72.45%, #000000 99.97%), url(${({ image }) => image});
  border-radius: 16px 16px 0px 0px;
  background-size: cover;
`
const CardLineBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  padding: 10px 16px;
  gap: 10px;
  width: 100%;
  height: 47px;
`
const CardAction = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 102px;
  background: #000000;
  border-radius: 0px 0px 16px 16px;
  padding: 0px 48px;
`
const CardInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 16px;
  width: 100%;
`
const PersionalInfoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:10px;
  color: #ffffff;
`
const Name = styled.div`
  white-space: nowrap;
  font-weight: 500;
  font-size: 32px;
  line-height: 48px;
  width:75%;
  height:48px;
  text-overflow: ellipsis;
  overflow: hidden;
`
const Age = styled.div`
  font-weight: 500;
  font-size: 28px;
  line-height: 42px;
`
const DescriptionBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #ffffff;
`
const Description = styled.div`
  font-size: 24px;
  max-width: 75%;
`
const Line = styled.div<{ active: boolean }>`
  width: 100%;
  height: 0px;
  border: ${({ active }) => active ? "2px solid #FFFFFF" : "2px solid rgba(0, 0, 0, 0.1)"};
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

  const router = useRouter()




  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }


  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < characters.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  const swiped = (direction: string, nameToDelete: string, index: number) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }
  const handleInfoClick = () => {
    router.push('/app/recs/profile')
  }
  return (
    <Layout>
      <Container>
        {characters.map((character, index) =>
          // @ts-ignore
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={index}
            onSwipe={(dir) => swiped(dir, character.name, index)}
          >
            <CardContainer>
              <CardContent image={character.avatar}>
                <CardLineBox>
                  <Line active={true} />
                  <Line active={false} />
                  <Line active={false} />
                </CardLineBox>
                <CardInfoBox>
                  <PersionalInfoBox>
                    <Name>{character.name}</Name>
                    <Age>{character.age}</Age>
                  </PersionalInfoBox>
                  <DescriptionBox>
                    <Description>{character.bio}</Description>

                    <Button shape='circle' icon={<InfoOutlined />} size='small' onClick={handleInfoClick} />
                  </DescriptionBox>
                </CardInfoBox>

              </CardContent>
              <CardAction>
                <Button shape='circle' icon={<CloseOutlined style={{ color: "#FF5E51", fontWeight: 'bold', fontSize: '32px' }} />} style={{ width: '80px', height: '80px', background: 'none', border: "2px solid #FF5E51" }} />
                <Button shape='circle' icon={<StarFilled style={{ color: '#07A6FF', fontSize: '24px' }} />} style={{ width: '55px', height: '55px', background: 'none', border: '2px solid #07A6FF' }} />
                <Button shape='circle' icon={<HeartFilled style={{ color: '#00D387', fontSize: '32px' }} />} style={{ width: '80px', height: '80px', background: 'none', border: ' 2px solid #00D387' }} />
              </CardAction>
            </CardContainer>
          </TinderCard>
        )}

      </Container>
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
