import styles from './ChatApp.module.css'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { AppstoreFilled } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaStoreAlt } from "react-icons/fa";
import Match from './Match';
import { UserProfile } from 'schema/ceramic/user';

type Props = {}
export enum TabType {
  MATCHES,
  MASSEGES
}
type MatchType = {
  walletAddress: string,
  name: string,
  avatar: string,
  lastMessage: string,
}
const matches: MatchType[] = [
  {
    walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
    name: "Jessica Lin",
    avatar: "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastMessage: "Hello"
  },
  {
    walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
    name: "Cheasea",
    avatar: "https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastMessage: "你好"
  },
  {
    walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
    name: "Jessica Sabrina Lin",
    avatar: "https://images.unsplash.com/photo-1514315384763-ba401779410f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=766&q=80",
    lastMessage: "Hello"
  },
  {
    walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
    name: "Cheasea",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastMessage: "你好"
  },
]


const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px;
  gap: 10px;
  width: 100%;
  height: 86px;
  background: linear-gradient(90deg, #18E3FF 0%, #18FFAC 100%);
`
const IconBox = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #000;
  opacity:0.52;
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 16px;
  gap: 10px;
  width: 100%;
  height: 67px;
`

interface TabProps {
  selected: boolean;
}
const Tab = styled.div<TabProps>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px;
  gap: 10px;
  width: 98px;
  height: 47px;
  border-bottom: ${props => props.selected ? "2px solid #18E3FF" : "none"};
`
const TabTextBox = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  /* identical to box height */

  display: flex;
  align-items: center;
  text-align: center;
`
interface ContentBoxProps {
  selectedTab: TabType;
}
const ContentBox = styled.div<ContentBoxProps>`
  display: flex; 
  flex-direction: ${props => props.selectedTab === TabType.MATCHES ? "row" : "column"};
  justify-content: ${props => props.selectedTab === TabType.MATCHES ? "space-between" : ""};
  gap:${props => props.selectedTab === TabType.MATCHES ? "10px" : "24px"};
  flex-wrap: ${props => props.selectedTab === TabType.MATCHES ? "wrap" : "nowrap"};
  padding: 10px 16px;
`

const MessageBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 16px;
`
const MessageUserName = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  display: flex;
  align-items: center;
  text-align: center;
`
const MessageText = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
color:#595959;
`

const Avatar = ({ imageUrl }: { imageUrl?: string }) => {
  if (imageUrl) {

    return (
      <div style={{ borderRadius: '50%', overflow: "hidden" }}>
        <img src={imageUrl} width={45} height={45} />
      </div>
    )
  }
  return <div className={styles.avatar}></div>
}


function ChatApp() {
  const userProfile = useAppSelector(state => state.user.userProfile) as UserProfile
  const [userName, setUserName] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [tabSelected, setTabSelected] = useState(TabType.MATCHES)
  useEffect(() => {
    if (userProfile.name) {
      setUserName(userProfile.name)
    }
    if (userProfile.profileBaseUri) {
      const index = userProfile.selectedProfileIndex
      setProfileImage(userProfile.profileBaseUri + index?.toString() + '.png')
    }
  }, [userProfile])
  const handleTabClick = (tab: number) => {
    setTabSelected(tab)
  }
  console.log("User profile", userProfile)
  return (
    <div>
      <Header>
        <Avatar imageUrl={profileImage} />
        <div className={styles.name}>{userName}</div>
        <IconBox>
          <FaStoreAlt style={{ color: "#fff", width: '22px', height: '20px' }} />
        </IconBox>

      </Header>
      <Tabs>
        <Tab key={TabType.MATCHES} selected={tabSelected == TabType.MATCHES} onClick={() => { setTabSelected(TabType.MATCHES) }}>
          <TabTextBox>Matches</TabTextBox>
        </Tab>
        <Tab key={TabType.MASSEGES} selected={tabSelected == TabType.MASSEGES} onClick={() => { setTabSelected(TabType.MASSEGES) }}>
          <TabTextBox>Messages</TabTextBox>
        </Tab>
      </Tabs>
      <ContentBox selectedTab={tabSelected}>
        {matches.map((match, index) => (
          <Match selectedTab={tabSelected} key={index} {...match} />
        ))}
      </ContentBox>
    </div>

  )
}

export default ChatApp
