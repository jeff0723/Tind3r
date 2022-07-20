import { Checkbox, Col, Row, Input, Radio, Button } from 'antd'
import NextImage from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UserProfile } from 'schema/ceramic/user';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { constants } from 'buffer';
import { useTind3rMembershipContract } from 'hooks/useContract';
import { openNotificationWithIcon } from 'utils/notification';
import useCeramic from 'hooks/useCeramic';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import config from 'schema/ceramic/model.json';
import { updateIsCeramicProfileExists, updateMembershipCreated } from 'state/user/reducer';
import { useAppSelector } from 'state/hooks';
import { makeStorageClient } from 'utils/web3-storage';
import { NextPage } from 'next'

type Props = {}
type Tind3rMembership = {
    name: string,
    description: string,
    image: string,
}
const Header = styled.div`
    border-bottom: 1px solid #D9D9D9;
    width: 100%;
    height: 87px;
    padding: 16px 32px 16px 64px;
`
const Content = styled.div`
    padding-top: 30px;
    max-width: 700px;
    margin: 0 auto;
`
const Title = styled.div`
    font-weight: 700;
    font-size: 32px;
    line-height: 48px;
    padding: 10px;
    text-align: center;
`
const FormField = styled.div`
    margin-bottom: 10px;
`
const FormLabel = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    margin-bottom: 10px;
`
const OptionalTitle = styled.div`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 24px;
    color: #000;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    &:after {
        content: "";
        display: block;
        width: 149.48px;
        height: 1px;
        background: #D9D9D9;
    }
    &:before {
        content: "";
        display: block;
        width: 149.48px;
        height: 1px;
        background: #D9D9D9;
    }
`
const SubmitArea = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 10px;
`

const UserProfileDefinitionId = config.definitions.UserProfile
const genderOption = [
    "WOMEN",
    "MEN",
    "EVERYONE"
]
const OnBoardingPage: NextPage = (props: Props) => {
    const router = useRouter()
    const { idx, isAuthenticated } = useCeramic()
    const { account } = useWeb3React()
    const tind3rMembershipContract = useTind3rMembershipContract()
    const [photoList, setPhotoList] = useState<UploadFile[]>([
        // {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
    ]);

    const [onBoardingInfo, setOnBoardingInfo] = useState<UserProfile>({
        name: "",
        birthday: "",
        bio: "",
        gender: 0, //0 women 1 men 2 everyone
        showMe: 0, //0 women 1 men 2 everyone 
        showMyGenderOnProfile: false,
        importNFT: false,
        addOnChainActivity: false,
        organizations: [],
        tags: []
    })

    const isCeramicProfileExists = useAppSelector(state => state.user.isCeramicProfileExists)
    const isMemberCreated = useAppSelector(state => state.user.isMembershipCreated)

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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOnBoardingInfo({
            ...onBoardingInfo,
            [e.target.name as string]: e.target.value
        } as UserProfile
        );
    }
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOnBoardingInfo({
            ...onBoardingInfo,
            [e.currentTarget.name as string]: +e.currentTarget.value
        } as UserProfile
        );

    }
    const handleCheckBoxChange = (e: CheckboxChangeEvent) => {
        setOnBoardingInfo({
            ...onBoardingInfo,
            [e.target.name as string]: e.target.checked
        } as UserProfile
        );
    }

    const getUserProfile = useCallback(async () => {
        if (isAuthenticated && idx) {
            console.log('getUserProfile')
            const res = await idx.get(UserProfileDefinitionId, `${account}@eip155:1`) as UserProfile
            console.log("UserProfle:", res)
        }
    }, [isAuthenticated, idx])
    const validateInput = (input: UserProfile) => {
        if (!input.name || !input.birthday || !photoList.length) return false
        return true
    }
    const handleConfirm = async () => {
        console.log(onBoardingInfo)
        if (!photoList.length) {
            openNotificationWithIcon("info", "Please upload at least one profile photo", "")
            return
        }
        if (!validateInput(onBoardingInfo)) {
            openNotificationWithIcon("info", "Please fill in required field", "")
            return
        }
        if (!tind3rMembershipContract) return
        const files = photoList.map((item, index) => {
            const newFile = new File([item.originFileObj as File], `${index}.png`, { type: 'image/png' });
            return newFile
        })
        const imageCount = files.length
        const client = makeStorageClient()
        const cid = await client.put(files)

        console.log("start to create")

        if (isAuthenticated) {
            const streamId = await idx?.set(UserProfileDefinitionId, {
                ...onBoardingInfo,
                profileBaseUri: `https://ipfs.io/ipfs/${cid}/`,
                profilePictureCounts: imageCount,
                selectedProfileIndex: 0,
            })
            console.log("profile set, stream ID:", streamId)
            if (streamId) {
                getUserProfile()
                const _memberShipInput: Tind3rMembership = {
                    name: onBoardingInfo.name,
                    description: streamId.toString(),
                    image: "ipfs://Qmd2VW9uTn1TuG6sP21SGCp41URP2eeyr2A4QhnU82wmyP",
                }

                const tx = await tind3rMembershipContract?.createProfile(_memberShipInput)
                const receipt = await tx?.wait()
                console.log('recepie', receipt)
                if (receipt.status) {
                    openNotificationWithIcon("success", "Success", "Profile created successfully")
                    // need to redirect to "app/recs"
                    // temporary redirect to "/" for testing
                    router.push('/')
                }
            } else {
                console.log("idx set error")
            }

        }
    }
    useEffect(() => {
        getUserProfile()
    }, [isAuthenticated, idx])

    console.log("Photolist", photoList)
    console.log("IDX authenticated", idx?.authenticated)
    console.log("Is Ceramic Profile Exists", isCeramicProfileExists)
    console.log("Is Membership Created", isMemberCreated)
    return (
        <div>
            <Header>
                <NextImage src='/images/logo-with-word-mix.png' width={176} height={55} />
            </Header>
            <Content>
                <Title>Create Account</Title>
                <Row gutter={30}>
                    <Col span={12}>
                        <FormField>
                            <FormLabel>First Name</FormLabel>
                            <Input placeholder='First Name' name='name' value={onBoardingInfo?.name} onChange={handleChange} />
                        </FormField>
                        <FormField>
                            <FormLabel>Birthday</FormLabel>
                            <Input type="date" placeholder='First Name' name='name' value={onBoardingInfo?.name} onChange={handleChange} />
                        </FormField>
                        <FormField>
                            <FormLabel>Gender</FormLabel>
                            {genderOption.map((item, index) =>
                                <Radio.Button
                                    key={index}
                                    value={index}
                                    disabled={index == onBoardingInfo?.gender}
                                    name='gender'
                                    style={{ borderRadius: '4px', marginLeft: index > 0 ? '10px' : '0' }}
                                    onClick={handleButtonClick}
                                >
                                    {genderOption[index]}
                                </Radio.Button>
                            )}
                        </FormField>
                        <FormField>
                            <Checkbox style={{ padding: '12px 0' }} name='showMyGenderOnProfile' onChange={handleCheckBoxChange} checked={onBoardingInfo?.showMyGenderOnProfile}> Show my gender on my profile</Checkbox>
                        </FormField>
                        <FormField>
                            <FormLabel>Show me</FormLabel>
                            {genderOption.map((item, index) =>
                                <Radio.Button
                                    key={index}
                                    value={index}
                                    disabled={index == onBoardingInfo?.showMe}
                                    name='showMe'
                                    style={{ borderRadius: '4px', marginLeft: index > 0 ? '10px' : '0' }}
                                    onClick={handleButtonClick}
                                >
                                    {genderOption[index]}
                                </Radio.Button>
                            )}
                        </FormField>
                        <FormField>
                            <Checkbox name='importNFT' onChange={handleCheckBoxChange} checked={onBoardingInfo?.importNFT}>Import NFT</Checkbox>
                        </FormField>
                        <FormField>
                            <Checkbox name='addOnChainActivity' onChange={handleCheckBoxChange} checked={onBoardingInfo?.addOnChainActivity}>Add onchain activity</Checkbox>
                        </FormField>
                    </Col>
                    <Col span={12}>
                        <FormField>
                            <FormLabel>Profile</FormLabel>
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
                        </FormField>
                    </Col>
                    <Col span={24}>
                        <OptionalTitle>Optional</OptionalTitle>
                        <FormField>
                            <FormLabel>My Organization</FormLabel>
                            <button>Add</button>
                        </FormField>
                        <FormField>
                            <FormLabel>Passion</FormLabel>
                            <button>Add</button>
                        </FormField>
                    </Col>
                </Row>
                <SubmitArea>
                    <Button
                        style={{ width: '96px', height: '30px', textAlign: 'center' }}
                        type="primary"
                        shape="round"
                        size='small'
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </SubmitArea>
            </Content>
        </div>
    )
}

export default OnBoardingPage