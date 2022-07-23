import { LoadingOutlined } from '@ant-design/icons';
import { useWeb3React } from '@web3-react/core';
import { Button, Checkbox, Col, Input, Radio, Row, Select, Spin, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import TextArea from 'antd/lib/input/TextArea';
import { ORGANIZATION_OPTIONS, PASSION_OPTIONS } from 'constants/options';
import useCeramic from 'hooks/useCeramic';
import { useTind3rMembershipContract } from 'hooks/useContract';
import { NextPage } from 'next';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import config from 'schema/ceramic/model.json';
import { UserProfile } from 'schema/ceramic/user';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { updateMembershipCreated, updateUserProfile } from 'state/user/reducer';
import styled from 'styled-components';
import { openNotificationWithIcon } from 'utils/notification';
import { makeStorageClient } from 'utils/web3-storage';


const { Option } = Select

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
    padding: 30px 0;
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
const Loading = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    opacity: 0.8;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
`

const styles = {
  radioButton: {
    borderRadius: '4px',
    lineHeight: '37px',
    height: '37px',
    'borderLeftWidth': '1px'
  }
}

const UserProfileDefinitionId = config.definitions.Tind3r
const genderOptions = [
  "WOMEN",
  "MEN",
  "EVERYONE"
]

enum UploadStatus {
  notUploading,
  ipfsUploading,
  ipfsFinished,
  ceramicFinished,
  finished,
}
const loadingWords = (status: UploadStatus) => {
  switch (status) {
    case UploadStatus.notUploading:
      return "Not uploading"
    case UploadStatus.ipfsUploading:
      return "Uploading Profile Image"
    case UploadStatus.ipfsFinished:
      return "Creating Profile"
    case UploadStatus.ceramicFinished:
      return "Creating Membership"
    case UploadStatus.finished:
      return "Finished"
  }
}


const OnBoardingPage: NextPage = (props: Props) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [uploadingStatus, setUploadingStatus] = useState<UploadStatus>(UploadStatus.notUploading)
  const router = useRouter()
  const { idx, isAuthenticated } = useCeramic()
  const { account, chainId } = useWeb3React()
  const tind3rMembershipContract = useTind3rMembershipContract()
  const [photoList, setPhotoList] = useState<UploadFile[]>([
    // {
    //     uid: '-1',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
  ]);

  const [onBoardingInfo, setOnBoardingInfo] = useState<UserProfile>()

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string[] | ChangeEvent<HTMLTextAreaElement>
    , name?: string) => {
    if (!Array.isArray(e)) {
      setOnBoardingInfo({
        ...onBoardingInfo,
        [e.target.name as string]: e.target.value
      } as UserProfile);
    } else {

      setOnBoardingInfo({
        ...onBoardingInfo,
        [name!]: e
      } as UserProfile);
    }
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
      idx.get(UserProfileDefinitionId, `${account}@eip155:${chainId}`)
        .then(res => dispatch(updateUserProfile({ userProfile: res })))
        .catch(err => console.log(err))


    }
  }, [isAuthenticated, idx, dispatch, account, chainId])
  const validateInput = (input?: UserProfile) => {
    if (!input?.name || !input.birthday || !photoList.length) return false
    return true
  }
  const handleConfirm = async () => {
    if (!onBoardingInfo) return
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
    setUploadingStatus(UploadStatus.ipfsUploading)
    setLoading(true)
    const imageCount = files.length
    const client = makeStorageClient()
    const cid = await client.put(files)
    setUploadingStatus(UploadStatus.ipfsFinished)



    if (isAuthenticated) {
      try {
        const streamId = await idx?.set(UserProfileDefinitionId, {
          ...onBoardingInfo,
          profileBaseUri: `https://ipfs.io/ipfs/${cid}/`,
          profilePictureCounts: imageCount,
          selectedProfileIndex: 0,
        })
        setUploadingStatus(UploadStatus.ceramicFinished)
        if (streamId) {
          getUserProfile()
          const _memberShipInput: Tind3rMembership = {
            name: onBoardingInfo.name,
            description: streamId.toString(),
            image: `https://ipfs.io/ipfs/${cid}/0.png`,
          }

          const tx = await tind3rMembershipContract?.createProfile(_memberShipInput)
          setUploadingStatus(UploadStatus.finished)
          const receipt = await tx?.wait()

          if (receipt.status) {
            setLoading(false)
            dispatch(updateMembershipCreated({ isMembershipCreated: true }))
            openNotificationWithIcon("success", "Success", "Profile created successfully")
            setOnBoardingInfo({} as UserProfile);
            // need to redirect to "app/recs"
            // temporary redirect to "/" for testing
            router.push('/app/recs')
          }
        } else {
          setLoading(false)
          console.log("idx set error")
        }
      } catch (error) {
        setLoading(false)
      }

    }
  }
  useEffect(() => {
    getUserProfile()
  }, [isAuthenticated, idx, getUserProfile])


  return (
    <div>
      {loading && <Loading><Spin size="large" tip={loadingWords(uploadingStatus)} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /></Loading>}
      <Header>
        <NextImage src='/images/logo-with-word-mix.png' width={176} height={55} />
      </Header>
      <Content>
        <Title>Create Account</Title>
        <Row gutter={70}>
          <Col span={12}>
            <FormField>
              <FormLabel>First Name</FormLabel>
              <Input placeholder='First Name' name='name' value={onBoardingInfo?.name} onChange={handleChange} />
            </FormField>
            <FormField>
              <FormLabel>Birthday</FormLabel>
              <Input type="date" name='birthday' value={onBoardingInfo?.birthday} onChange={handleChange} />
            </FormField>
            <FormField>
              <FormLabel>Gender</FormLabel>
              <Radio.Group name='gender' buttonStyle="solid">
                {genderOptions.map((item, index) =>
                  <Radio.Button
                    key={index}
                    value={index}
                    checked={index == onBoardingInfo?.gender}
                    name='gender'
                    style={{ ...styles.radioButton, marginLeft: index > 0 ? '10px' : '0' }}
                    onClick={handleButtonClick}
                  >
                    {genderOptions[index]}
                  </Radio.Button>
                )}
              </Radio.Group>
            </FormField>
            <FormField>
              <Checkbox style={{ padding: '12px 0' }} name='showMyGenderOnProfile' onChange={handleCheckBoxChange} checked={onBoardingInfo?.showMyGenderOnProfile}> Show my gender on my profile</Checkbox>
            </FormField>
            <FormField>
              <FormLabel>Show me</FormLabel>
              <Radio.Group name='showMe' buttonStyle="solid">
                {genderOptions.map((item, index) =>
                  <Radio.Button
                    key={index}
                    value={index}

                    checked={index == onBoardingInfo?.showMe}
                    name='showMe'
                    style={{ ...styles.radioButton, marginLeft: index > 0 ? '10px' : '0' }}
                    onClick={handleButtonClick}
                  >
                    {item}
                  </Radio.Button>
                )}
              </Radio.Group>
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
              <FormLabel>Bio</FormLabel>
              <TextArea name="bio" onChange={handleChange} placeholder='Your short bio' />
            </FormField>
            <FormField>
              <FormLabel>Your Web3 role</FormLabel>
              {/* @ts-ignore */}
              <Select mode="tags" style={{ width: '100%' }} onChange={(e) => handleChange(e, 'organizations')}>
                {ORGANIZATION_OPTIONS.map(option => <Option name="organizations" key={option} value={option}>{option}</Option>)}
              </Select>
            </FormField>
            <FormField>
              <FormLabel>What kind of people you want to meet</FormLabel>
              {/* @ts-ignore */}
              <Select mode="tags" style={{ width: '100%' }} onChange={(e) => handleChange(e, 'tags')}>
                {PASSION_OPTIONS.map(option => <Option name="tags" key={option} value={option}>{option}</Option>)}
              </Select>
            </FormField>
          </Col>
        </Row>
        <SubmitArea>
          <Button
            style={{ width: '120px', height: '36px', textAlign: 'center', borderRadius: '24px' }}
            type='primary'
            onClick={handleConfirm}
            disabled={!validateInput(onBoardingInfo)}
          >
            Confirm
          </Button>
        </SubmitArea>
      </Content>
    </div>
  )
}

export default OnBoardingPage