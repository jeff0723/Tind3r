import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Message } from '@xmtp/xmtp-js'
import { Avatar, Button, Input } from 'antd'
import { ButtonProps } from 'antd/lib/button/button'
import useConversation from 'hooks/useConversation'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'




const ConversationBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const ConversationHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    width: 100%;
    height: 86px;
    border-bottom: 1px solid #D9D9D9;
    flex-shrink: 0;
`
const ConversationHeaderInfo = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
`
const ConversationContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 16px;
    gap: 10px;
    width: 100%;
    height: 797px;
    overflow-y: scroll;
`

const DateLine = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    display: flex;
    justify-content: center;
    color: #8C8C8C;
`
const MyMessage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
    height: 41px;
    color:#fff;
    background: #07A6FF;
    border-radius: 14px 4px 4px 14px;
`
const PeerMessage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 10px 10px;
    background: #F5F5F5;
    border-radius: 4px 14px 14px 4px;
`
const MessageSendContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    width: 100%;
    height: 10vh;
    border-top: 1px solid #D9D9D9;
`

const MessageSendBox = styled.form`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 10px;
    gap: 10px;
    width: 100%;
    background: #F5F5F5;
    border: 1px solid #BFBFBF;
    border-radius: 48px;
`


const PlusButton = styled((props: ButtonProps) => <Button {...props} />)`
    background-color:#18E3FF;
    border:none;
`;

const TextInput = styled(Input)`
    background-color:#18E3FF;
    border: none; 
    background: none;
  
`;


const SendButton = styled((props: ButtonProps) => <Button {...props} />)`
    background: #D9D9D9;
    border-radius: 24px;
    font-weight: 300;
    font-size: 16px;
    line-height: 27px;
    display: flex;
    align-items: center;
    color: #8C8C8C;
`;
type ConversationProps = {
    avatar: string,
    matchTime: string,
    name: string,
}
type Props = {
    peerAddress: string
    imageUrl: string
    name?: string
}
const formatDate = (date?: Date) => {
    return date?.toLocaleDateString('en-US') + ',' + date?.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
}

const isThirtyMinutesDifference = (lastSent: Date, msgSent: Date) => {
    return Math.abs(msgSent.getTime() - lastSent.getTime()) > 1800000
}
const Conversation = ({ peerAddress, imageUrl, name }: Props) => {
    const { messages, sendMessage, loading } = useConversation(peerAddress)
    const { account } = useWeb3React()
    const [message, setMessage] = useState("")
    const router = useRouter()
    let lastMessageDate: Date | undefined

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            await sendMessage(message)
        },
        [sendMessage, message]
    )
    const handleExit = () => {
        router.push('/app/recs')
    }
    return (
        <ConversationBox>
            <ConversationHeader>
                <ConversationHeaderInfo>
                    <Avatar src={imageUrl} />
                    You Matched with {name} on 7/23/2022
                </ConversationHeaderInfo>
                <Button shape='circle' icon={<CloseOutlined />} style={{ color: '#BFBFBF' }} onClick={handleExit} />
            </ConversationHeader>
            <ConversationContent>
                {messages.length ? messages.map((message: Message, index) => {
                    const isSender = message.senderAddress === account
                    // return <DateLine>{formatDate(message.sent)}
                    // </DateLine>
                    // const isSameSender = lastSender === message.senderAddress
                    let needDateline = false
                    if (lastMessageDate && message.sent) {
                        needDateline = isThirtyMinutesDifference(lastMessageDate, message.sent)
                    }
                    const Tile = (): JSX.Element => {
                        if (isSender) return <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <MyMessage>{message.content}</MyMessage>
                        </div>
                        return (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Avatar src={imageUrl} />
                                <PeerMessage>{message.content}</PeerMessage>
                            </div>

                        )
                    }
                    lastMessageDate = message.sent
                    return (
                        <>
                            {needDateline ? <DateLine>{formatDate(message.sent)}</DateLine> : null}
                            <Tile />
                        </>
                    )
                }) : <div>No messages</div>}
            </ConversationContent>
            <MessageSendContainer>
                <MessageSendBox onSubmit={handleMessageSend}>
                    {/* Todo 1 - remove input area focused
                    Todo 2 - Change it to form  */}
                    <PlusButton shape='circle' icon={<PlusOutlined style={{ color: '#fff' }} />} />
                    <TextInput bordered={false} placeholder='Type a message' onChange={handleMessageChange} value={message} />
                    <SendButton htmlType="submit"> SEND</SendButton>
                </MessageSendBox>
            </MessageSendContainer>
        </ConversationBox>
    )
}

export default Conversation