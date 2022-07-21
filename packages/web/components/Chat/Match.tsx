import { Avatar } from 'antd';
import Router, { useRouter } from 'next/router';
import React from 'react'
import styled from 'styled-components';
import { TabType } from './ChatApp';

type Props = {
    selectedTab: number,
    walletAddress: string,
    name: string,
    avatar: string,
    lastMessage: string,
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
const Match = (props: Props) => {
    const router = useRouter()
    const handleClick = () => {
        router.push('/app/message/' + props.walletAddress)
    }
    if (props.selectedTab === TabType.MATCHES) {
        return (
            <MatchCard imageUrl={props.avatar} onClick={handleClick}>
                {props.name}
            </MatchCard>
        )
    }
    return (
        <MessageBox onClick={handleClick}>
            <Avatar src={props.avatar} style={{ width: '74px', height: '74px' }} />
            <div>
                <MessageUserName>
                    {props.name}
                </MessageUserName>
                <MessageText>
                    {props.lastMessage}
                </MessageText>
            </div>
        </MessageBox>
    )
}

export default Match