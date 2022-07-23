import ChatApp from 'components/Chat'
import Conversation from 'components/Conversation'
import useCeramic from 'hooks/useCeramic'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import config from 'schema/ceramic/model.json'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { UserProfile } from 'schema/ceramic/user'
import { calculateAge } from 'utils'
import { LeftOutlined, RightOutlined, SelectOutlined } from '@ant-design/icons';
import { EXPLORER_URL } from 'constants/networks'
const Profile = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  overflow-y: scroll;
`
const MinusImgIndexBtn = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 200px;
  padding:0px 10px;
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
  padding:0px 10px;
  display: none;
  justify-content: flex-end;
  align-items: center;
  color: #fff;
`
const ProfileAvatar = styled.div<({ image: string }) >`
  width: 100%;
  min-height: 475px;
  background: url(${({ image }) => image});
  background-size: cover;
  background-position: 50% 50%;
  &:hover {
    cursor: pointer;
  }
  &:hover ${MinusImgIndexBtn} {
    display: flex;
  }
  &:hover ${AddImgIndexBtn} {
    display: flex;
  }
  position: relative;

`

const ProfileInfo = styled.div`
  margin-top: 5px;
  padding: 10px 16px 20px;
`
const ProfileTitle = styled.div`
  display: flex;
  align-items: center;
`
const Name = styled.div`
  font-weight: 700;
  font-size: 32px;
  line-height: 48px;
  color: #000000;
`
const Age = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;
  color: #000000;
  margin-left: 5px;
`
const ProfileSubtitle = styled.div`
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  color: #8C8C8C;
`
const Subtitle = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;

`

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 10px;
`
const Tag = styled.div`
  padding: 3px 10px;
  border: 1px solid #8C8C8C;
  border-radius: 32px;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #8C8C8C;
`
const ReportArea = styled.div`
  font-weight: 400;
  font-size: 18px;
  color: #8C8C8C;
  height: 10vh;
  background: #BFBFBF;
  text-align: center;
  display:flex;
  align-items: center;
  justify-content: center;
`
const LineBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  padding: 10px 16px;
  gap: 10px;
  width: 100%;
  height: 47px;
`
const Line = styled.div<{ active: boolean }>`
  width: 100%;
  height: 0px;
  border: ${({ active }) => active ? "2px solid #FFFFFF" : "2px solid rgba(0, 0, 0, 0.1)"};
`

const character = {
  walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
  name: "Jessica Lin",
  age: '22',
  avatar: "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  bio: "一堆戴口罩是想表示重視疫情嗎？",
}
const UserProfileDefinitionId = config.definitions.Tind3r

const MessagePage: NextPage = () => {
  const router = useRouter()
  const { chainId } = useWeb3React()
  const { idx, isAuthenticated } = useCeramic()
  const messageId = router.query.messageId as string
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [imageUrl, setImageUrl] = useState('')
  const [userProfile, setUserProfile] = useState<UserProfile>()
  useEffect(() => {
    if (idx && isAuthenticated && chainId) {
      idx.get(UserProfileDefinitionId, `${messageId}@eip155:${chainId}`)
        .then(res => setUserProfile(res as UserProfile))
        .catch(err => console.log(err))
    }
  }, [idx, isAuthenticated, chainId, messageId])
  const handleClickAddImgIndexBtn = () => {
    if (!userProfile) return
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
  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ width: '25vw', minWidth: '390px', maxWidth: '414px' }}>
        <ChatApp />
      </div>
      <div style={{ flexGrow: 1 }}>
        <Conversation peerAddress={ethers.utils.getAddress(messageId)} imageUrl={userProfile?.profileBaseUri + "0.png"} name={userProfile?.name} />
      </div>
      <div style={{ width: '25vw', minWidth: '390px', maxWidth: '414px' }}>
        <Profile>
          <ProfileAvatar image={userProfile?.profileBaseUri + currentImgIndex.toString() + '.png'}>
            <LineBox>
              {
                [...Array(userProfile?.profilePictureCounts).keys()]
                  .map(index => <Line key={index} active={index === currentImgIndex} />)
              }
            </LineBox>
            {userProfile ?
              userProfile?.profilePictureCounts > 1 && <>
                <MinusImgIndexBtn onClick={handleClickMinusImgIndexBtn}>
                  <LeftOutlined style={{ fontSize: 20 }} />
                </MinusImgIndexBtn>
                <AddImgIndexBtn onClick={handleClickAddImgIndexBtn}>
                  <RightOutlined style={{ fontSize: 20 }} />
                </AddImgIndexBtn>
              </> :
              <></>
            }
          </ProfileAvatar>
          <ProfileInfo style={{ borderBottom: '1px solid #BFBFBF' }}>
            <ProfileTitle>
              <Name>{userProfile?.name}</Name>
              <Age>{calculateAge(userProfile?.birthday as string)}</Age>

              <a href={EXPLORER_URL + "address/" + userProfile?.walletAddress} target="_blank" rel="noopener noreferrer">
                <SelectOutlined />
              </a>
            </ProfileTitle>
            <ProfileSubtitle>134 kilometers away</ProfileSubtitle>
          </ProfileInfo>
          <ProfileInfo style={{ borderBottom: '1px solid #BFBFBF' }}>
            <Subtitle>About Me</Subtitle>

            <ProfileSubtitle>Surfing / Hiking / Alcohol / Artist</ProfileSubtitle>
            <TagList>
              <Tag>Sagittarius</Tag>
              <Tag>IPFS</Tag>
              <Tag>DAO</Tag>
              <Tag>DEFI</Tag>
            </TagList>
          </ProfileInfo>
          <ProfileInfo>
            <Subtitle>Passions</Subtitle>

            <TagList>
              {userProfile?.tags?.map(tag => <Tag key={tag}>{tag.toUpperCase()}</Tag>)}

            </TagList>
          </ProfileInfo>
        </Profile>

        <ReportArea>
          <div>REPORT</div>
        </ReportArea>
      </div>
    </div>
  )
}

export default MessagePage
