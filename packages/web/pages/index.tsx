import React from 'react'

import styled from 'styled-components'
import Image from 'next/image'
import { openNotificationWithIcon } from 'utils/notification'
import { injectedConnection } from 'connection'
import { useRouter } from 'next/router'
type Props = {}

const ImageBackground = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%), url(https://tinder.com/static/build/379766df6d9620c8f7e0bcc39c6905e2.webp);
`
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;

`
const LoginButton = styled.button`
    background: #fff;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #18E3FF;
    width: 138px;
    height: 58px;
    border: none;
    font-size: 18px;
    font-weight: 600;

`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    height: 75vh;
`

const Title = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-weight: 600;
    font-size: 108px;
    line-height: 162px;
    color: #FFFFFF;
`

const CTAButton = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color:#fff;
    width: 277px;
    height: 65px;
    border:none;
    background: linear-gradient(90.27deg, #18E3FF 0.2%, #18FF90 97.79%);
    border-radius: 32px;
    font-size: 16px;
`
const index = (props: Props) => {
    const router = useRouter()
    const handleCTAButtonClick = async () => {
        if (!window.ethereum) {
            // This should be change to a modal
            openNotificationWithIcon('info', 'Wallet not installed', 'Please install MetaMask')
            return
        }
        await injectedConnection.connector.activate()
        openNotificationWithIcon('success', 'Connected', 'You are now connected to the blockchain')
        router.push('/app/onboarding')
    }
    return (
        <ImageBackground>
            <Header>
                <Image src='/images/logo-with-word-white.png' width={293} height={92} />
                <LoginButton>Log In</LoginButton>
            </Header>
            <Content>
                <Title>Tinder for web3</Title>
                <CTAButton onClick={handleCTAButtonClick}>Create Account</CTAButton>
            </Content>
        </ImageBackground>

    )
}

export default index