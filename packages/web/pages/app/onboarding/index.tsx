import { Checkbox } from 'antd'
import NextImage from 'next/image'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
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
    const [photoList, setPhotoList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
    ]);
    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setPhotoList(newFileList);
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const uploadAction = (file: RcFile) => {
        console.log(file)
        return 'hi'
    }
    console.log(photoList)
    return (
        <div>
            <Header>
                <NextImage src='/images/logo-with-word-mix.png' width={176} height={55} />
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
                                <input placeholder='MM' type={'date'} />
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
                        <OptionalHeader>
                            <Line />
                            <span>Optional</span>
                            <Line />
                        </OptionalHeader>
                        <InfoBox>
                            <Heading>My Organization</Heading>
                            <button>Add</button>
                        </InfoBox>
                        <InfoBox>
                            <Heading>Passion</Heading>
                            <button>Add</button>
                        </InfoBox>
                    </RequiredLeftColumn>
                    <RequiredRightColumn>
                        <InfoBox>
                            <Heading>Profile</Heading>
                            <InputBox>
                                <ImgCrop rotate>
                                    <Upload
                                        listType="picture-card"
                                        fileList={photoList}
                                        onChange={onChange}
                                        onPreview={onPreview}
                                    >
                                        {photoList.length < 5 && '+ Upload'}
                                    </Upload>
                                </ImgCrop>
                            </InputBox>
                        </InfoBox>

                    </RequiredRightColumn>
                </RequiredInfoBox>
                <ConfirmBox>
                    <button>Confirm</button>
                </ConfirmBox>
            </Content>
        </div>
    )
}

export default index