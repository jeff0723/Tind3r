import ChatApp from 'components/Chat'
import Conversation from 'components/Conversation'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'


const Profile = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ProfileAvatar = styled.div<({ image: string }) >`
  width: 100%;
  height: 475px;
  background: url(${({ image }) => image});
  background-size: cover;
  background-position: 50% 50%;
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
  line-height: 99px;
  height: 99px;
  background: #BFBFBF;
  text-align: center;
  margin-top: auto;
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

const MessagePage: NextPage = () => {
  const router = useRouter()
  const messageId = router.query.messageId as string

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ width: '25vw', minWidth: '390px', maxWidth: '414px' }}>
        <ChatApp />
      </div>
      <div style={{ flexGrow: 1 }}>
        <Conversation peerAddress={messageId} />
      </div>
      <div style={{ width: '25vw', minWidth: '390px', maxWidth: '414px' }}>
        <Profile>
          <ProfileAvatar image={character.avatar}>
            <LineBox>
              <Line active={true} />
              <Line active={false} />
              <Line active={false} />
            </LineBox>
          </ProfileAvatar>
          <ProfileInfo style={{ borderBottom: '1px solid #BFBFBF'}}> 
            <ProfileTitle>
              <Name>{character.name}</Name>
              <Age>{character.age}</Age>
            </ProfileTitle>
            <ProfileSubtitle>134 kilometers away</ProfileSubtitle>
          </ProfileInfo>
          <ProfileInfo>
            <ProfileSubtitle>游泳/爬山/喝酒/日光浴</ProfileSubtitle>
            <TagList>
              <Tag>Sagittarius</Tag>
              <Tag>IPFS</Tag>
              <Tag>DAO</Tag>
              <Tag>DEFI</Tag>
            </TagList>
          </ProfileInfo>
          <ReportArea>
            REPORT
          </ReportArea>
        </Profile>
      </div>
    </div>
  )
}

export default MessagePage
