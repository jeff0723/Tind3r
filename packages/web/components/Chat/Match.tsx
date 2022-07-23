import { Avatar } from 'antd';
import Router, { useRouter } from 'next/router';
import React from 'react'
import styled from 'styled-components';
import { TabType } from './ChatApp';
import { MatchProfile } from 'schema/ceramic/user';

type Props = {
    match: MatchProfile
    selectedTab: TabType
}

interface ImageProps {
    imageUrl: string;
}
const MatchCard = styled.div<ImageProps>`
  width: 110px;
  height: 143px;
  background: url(${props => props.imageUrl});
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 4px;
  color: #fff;
  display: flex;
  align-items: flex-end;
  padding: 10px 16px;
  font-size: 18px;
  font-weight:500;
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
const Match = ({ match, selectedTab }: Props) => {
    const router = useRouter()
    const handleClick = () => {
        router.push('/app/message/' + match.walletAddress)
    }
    if (selectedTab === TabType.MATCHES) {
        return (
            <MatchCard imageUrl={match.profileBaseUri + match.selectedProfileIndex.toString() + '.png'} onClick={handleClick}>
                {match.name}
            </MatchCard>
        )
    }
    return (
        <MessageBox onClick={handleClick}>
            <Avatar src={match.profileBaseUri + match.selectedProfileIndex.toString() + '.png'} style={{ width: '74px', height: '74px' }} />
            <div>
                <MessageUserName>
                    {match.name}
                </MessageUserName>
                <MessageText>
                    {match.lastMessage}
                </MessageText>
            </div>
        </MessageBox>
    )
}

export default Match