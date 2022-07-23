import { CloseOutlined, HeartFilled, InfoOutlined, StarFilled } from '@ant-design/icons';
import { Avatar, Button, Input, Modal } from 'antd';
import { useTind3rMembershipContract } from 'hooks/useContract';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import { UserProfile } from 'schema/ceramic/user';
import { updateSelectedProfile } from 'state/application/reducer';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import styled from 'styled-components';
import { calculateAge } from 'utils';
import { openNotificationWithIcon } from 'utils/notification';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useWeb3React } from '@web3-react/core';
import useConversation from 'hooks/useConversation';
import { ethers } from 'ethers';


const MinusImgIndexBtn = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 200px;
  padding: 0 10px;
  display: none;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
`
const AddImgIndexBtn = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 200px;
  padding: 0 10px;
  display: none;
  justify-content: flex-end;
  align-items: center;
  color: #fff;
`

const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 375px;
  border-radius: 16px;
  &:hover {
    cursor: pointer;
  }
  &:hover ${MinusImgIndexBtn} {
    display: flex;
  }
  &:hover ${AddImgIndexBtn} {
    display: flex;
  }
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
  background-repeat: no-repeat;
  background-position: center;
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
  height: 124px;
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
type Props = {
  userProfile: UserProfile
  swiperCardRef: any
  index: number
}


const SwiperCard = ({ userProfile, swiperCardRef, index }: Props) => {
  const myUserProfile = useAppSelector(state => state.user.userProfile);
  const { sendMessage } = useConversation(ethers.utils.getAddress(userProfile.walletAddress as string))

  const { account } = useWeb3React()
  const tind3rMembershipContract = useTind3rMembershipContract()
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const profileList = useAppSelector(state => state.application.recommendationList);
  const dipatch = useAppDispatch();
  const router = useRouter()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLike = async () => {
    if (!tind3rMembershipContract || !userProfile.walletAddress || !account) return
    const isLiked = await tind3rMembershipContract.ifLike(userProfile.walletAddress, account)
    console.log(isLiked)
    if (userProfile.walletAddress) {
      try {
        const tx = await tind3rMembershipContract.like(userProfile.walletAddress)
        if (isLiked) {
          setIsModalVisible(true)
        }
        const receipt = await tx.wait()
        if (receipt.status) {
          openNotificationWithIcon("success", "Success", `You liked ${userProfile.name}`)

        }
      } catch (e) {
        openNotificationWithIcon("error", "Error", e.message)
      }
    }

  }
  const handlePass = () => {
    console.log("pass")
  }
  const handleInfoClick = () => {
    if (profileList) {
      dipatch(updateSelectedProfile({ selectedProfile: profileList[index] }))
    }
    router.push('/app/recs/profile')

  }
  const handleSwipe = async (dir: string) => {
    if (dir == "right") {
      handleLike()
    }
    else {
      handlePass()
    }
  }
  const handleClickAddImgIndexBtn = () => {
    if (currentImgIndex === userProfile.profilePictureCounts - 1) {
      setCurrentImgIndex(0)
      return
    }

    setCurrentImgIndex(currentImgIndex + 1)
  }
  const handleClickMinusImgIndexBtn = () => {
    if (currentImgIndex === 0) return
    setCurrentImgIndex(currentImgIndex - 1)
  }

  const swipe = async (dir: string) => {

    swiperCardRef.current.swipe(dir) // Swipe the card!
  }
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setMessage(e.target.value)
  }
  const handleMessageSend = useCallback(
    async (e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault()
      if (!message) {
        return
      }
      setMessage('')
      setIsModalVisible(false)
      await sendMessage(message)
    },
    [sendMessage, message]
  )
  console.log(message)
  return (
    //@ts-ignore
    <TinderCard
      ref={swiperCardRef}
      className='swipe'
      onSwipe={handleSwipe}
      preventSwipe={['up', 'down']}
    >
      <CardContainer>
        <CardContent image={userProfile.profileBaseUri + currentImgIndex.toString() + '.png'}>
          <CardLineBox>
            {
              [...Array(userProfile.profilePictureCounts).keys()]
                .map(index => <Line key={index} active={index === currentImgIndex} />)
            }
          </CardLineBox>
          <CardInfoBox>
            <PersionalInfoBox>
              <Name>{userProfile.name}</Name>
              <Age>{calculateAge(userProfile.birthday)}</Age>
            </PersionalInfoBox>
            <DescriptionBox>
              <Description>{userProfile.bio}</Description>

              <Button shape='circle' icon={<InfoOutlined />} size='small' onClick={handleInfoClick} style={{ zIndex: 1 }} />
            </DescriptionBox>
          </CardInfoBox>

        </CardContent>
        <CardAction>
          <Button shape='circle' icon={<CloseOutlined style={{ color: "#FF5E51", fontWeight: 'bold', fontSize: '32px' }} />} style={{ width: '80px', height: '80px', background: 'none', border: "2px solid #FF5E51", zIndex: 1 }} onClick={() => { swipe("left") }} />
          <Button shape='circle' icon={<StarFilled style={{ color: '#07A6FF', fontSize: '24px' }} />} style={{ width: '55px', height: '55px', background: 'none', border: '2px solid #07A6FF', zIndex: 1 }} />
          <Button shape='circle' icon={<HeartFilled style={{ color: '#00D387', fontSize: '32px' }} />} style={{ width: '80px', height: '80px', background: 'none', border: ' 2px solid #00D387', zIndex: 1 }} onClick={() => { swipe("right") }} />
        </CardAction>
        {
          userProfile.profilePictureCounts > 1 && <>
            <MinusImgIndexBtn onClick={handleClickMinusImgIndexBtn}>
              <LeftOutlined style={{ fontSize: 20 }} />
            </MinusImgIndexBtn>
            <AddImgIndexBtn onClick={handleClickAddImgIndexBtn}>
              <RightOutlined style={{ fontSize: 20 }} />
            </AddImgIndexBtn>
          </>
        }
      </CardContainer>

      <Modal title="Congratulations. You have a new match!" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={false} >

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Avatar src={myUserProfile.profileBaseUri + '0.png'} alt="you" style={{ width: '150px', height: '150px' }} />
            <div style={{ fontWeight: 500 }}> {myUserProfile.name}</div>
          </div>
          <div style={{ fontStyle: 'italic', fontSize: '24px' }}>MATCH </div>
          <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Avatar src={userProfile.profileBaseUri + '0.png'} alt="you" style={{ width: '150px', height: '150px' }} />
            <div style={{ fontWeight: 500 }}>{userProfile.name}</div>
          </div>

        </div>

        <form style={{ padding: '0px 32px', display: 'flex', marginTop: '32px' }} onSubmit={handleMessageSend}>

          <Input placeholder='Say something...' onChange={handleMessageChange} value={message} />
          <Button htmlType="submit" style={{ border: 'none', color: '#1890ff' }}>SEND</Button>
        </form>
      </Modal>
    </TinderCard >
  )
}

export default SwiperCard