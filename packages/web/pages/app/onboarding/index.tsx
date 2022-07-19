import { Checkbox } from 'antd'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

type Props = {}

const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    border-bottom: 1px solid #D9D9D9;
    width: 100%;
    height: 87px;
    padding: 16px 32px 16px 64px;
`
const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const TitleBox = styled.div`
    padding: 10px;
`
const Title = styled.div`
    font-weight: 700;
    font-size: 32px;
    line-height: 48px;
`
const RequiredInfoBox = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`
const RequiredLeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 10px;
`
const RequiredRightColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 10px;
`
const InfoBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 10px;
`
const Heading = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    display: flex;
    align-items: center;
    text-align: center;
`
const InputBox = styled.div`
    display: flex;
    gap:10px;
`
const OptionalHeader = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 0px;
gap: 24px;
`
const Line = styled.div`
width: 149.48px;
height: 0px;
border: 1px solid #D9D9D9;
`
const OptionalContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 0px;
gap: 24px;

`
const OptionalContentBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 10px;
`
const ConfirmBox = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`
const UploadButton = (
    <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

const index = (props: Props) => {
    return (
        <div>
            <Header>
                <Image src='/images/logo-with-word-mix.png' width={176} height={55} />
            </Header>
            <Content>
                <TitleBox>
                    <Title>Create Account</Title>
                </TitleBox>
                <RequiredInfoBox>
                    <RequiredLeftColumn>
                        <InfoBox>
                            <Heading>First Name</Heading>
                            <input placeholder='First Name' />
                        </InfoBox>
                        <InfoBox>
                            <Heading>Birthday</Heading>
                            <InputBox>
                                <input placeholder='MM' />
                                <input placeholder='DD' />
                                <input placeholder='YY' />
                            </InputBox>

                        </InfoBox>
                        <InfoBox>
                            <Heading>Gender</Heading>
                            <InputBox>
                                <button>MEN</button>
                                <button>WOMEN</button>
                                <button>EVERYONE</button>
                            </InputBox>
                            <Checkbox> Show my gender on my profile</Checkbox>
                        </InfoBox>
                        <InfoBox>
                            <Heading>Show me</Heading>
                            <InputBox>
                                <button>MEN</button>
                                <button>WOMEN</button>
                                <button>EVERYONE</button>
                            </InputBox>
                            <div>
                                <Checkbox>Import NFT</Checkbox>
                            </div>
                            <div>
                                <Checkbox>Add onchain activity</Checkbox>
                            </div>
                        </InfoBox>
                    </RequiredLeftColumn>
                    <RequiredRightColumn>
                        <InfoBox>
                            <Heading>Profile</Heading>
                            <InputBox>
                                <Upload>{UploadButton}</Upload>
                                <Upload>{UploadButton}</Upload>
                                <Upload>{UploadButton}</Upload>
                            </InputBox>
                            <InputBox>
                                <Upload>{UploadButton}</Upload>
                                <Upload>{UploadButton}</Upload>
                                <Upload>{UploadButton}</Upload>
                            </InputBox>
                        </InfoBox>

                    </RequiredRightColumn>
                </RequiredInfoBox>
                <OptionalHeader>
                    <Line />
                    <span>Optional</span>
                    <Line />
                </OptionalHeader>
                <OptionalContainer>
                    <OptionalContentBox>
                        <InfoBox>
                            <Heading>My Organization</Heading>
                            <button>Add</button>
                        </InfoBox>
                        <InfoBox>
                            <Heading>Passion</Heading>
                            <button>Add</button>
                        </InfoBox>
                    </OptionalContentBox>
                </OptionalContainer>
                <ConfirmBox>
                    <button>Confirm</button>
                </ConfirmBox>
            </Content>
        </div>
    )
}

export default index