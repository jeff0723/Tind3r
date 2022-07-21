import { CloseOutlined, PlusCircleFilled, PlusOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Avatar, Button, Input } from 'antd'
import useConversation from 'hooks/useConversation'
import useMessageStore from 'hooks/useMessageStore'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Message } from '@xmtp/xmtp-js'
import { ButtonProps } from 'antd/lib/button/button';
import { InputProps } from 'antd/lib/input/input';
import styles from './Conversation.module.css'




const ConversationBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 690px;
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
    width: 690px;
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
    align-items: flex-start;
    padding: 10px 10px;
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
    height: 69px;
    border-top: 1px solid #D9D9D9;
`

const MessageSendBox = styled.form`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 10px;
    gap: 10px;
    width: 658px;
    background: #F5F5F5;
    border: 1px solid #BFBFBF;
    border-radius: 48px;
`


const PlusButton = styled((props: ButtonProps) => <Button {...props} />)`
    background-color:#18E3FF;
    border:none;
`;

const TextInput = styled((props: InputProps) => <Input {...props} />)`
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
const AvatarUrl = "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
const Conversation = ({ peerAddress }: Props) => {
    const { messages, sendMessage, loading } = useConversation(peerAddress)
    const { account } = useWeb3React()
    const [message, setMessage] = useState("")
    // console.log('meesage sent:', messages[0].sent)
    // console.log('meesage content:', messages[0].content)
    // console.log('meesage timestamp:', messages[0].senderAddress)

    let lastMessageDate: Date | undefined
    let lastSender: string | undefined

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
    return (
        <ConversationBox>
            <ConversationHeader>
                <ConversationHeaderInfo>
                    <Avatar src="https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" />
                    You Matched with Hi on 7/15/2022
                </ConversationHeaderInfo>
                <Button shape='circle' icon={<CloseOutlined />} style={{ color: '#BFBFBF' }} />
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
                                <Avatar src={AvatarUrl} />
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
                    <TextInput placeholder='Type a message' onChange={handleMessageChange} value={message} />
                    <SendButton htmlType="submit"> SEND</SendButton>
                </MessageSendBox>
            </MessageSendContainer>
        </ConversationBox>
    )
}

export default Conversation