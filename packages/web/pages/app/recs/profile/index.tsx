import { Button } from 'antd'
import Layout from 'components/Layout'
import React from 'react'
import styled from 'styled-components'
import { BsArrowLeftSquare, BsArrowRightSquare, BsArrowUpSquare } from 'react-icons/bs'
import { ArrowDownOutlined, CloseOutlined, HeartFilled, ManOutlined, StarFilled, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'
import { useAppSelector } from 'state/hooks'
import { calculateAge, convertGenderToText, GenderType } from 'utils'
import { UserProfile } from 'schema/ceramic/user'
import { useTind3rMembershipContract } from 'hooks/useContract'


type Props = {}
const HelperContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:50px;
  position: absolute;
  bottom:2.5vh;
`
const InstructionBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  color:#595959;
`
const StyledButton = styled(Button)`
  background: #595959;
  border-radius: 18px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #FFFFFF;
`
const ProfileCardContainer = styled.div`
  width:375px;
  height:690px;
  background: #FFFFFF;
  overflow-y:scroll;
  border-radius: 16px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  position:relative;
`
const CardImage = styled.div<({ image: string }) >`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width:100%;
  height:475px;
  flex-shrink: 0;
  background: linear-gradient(180.03deg, rgba(0, 0, 0, 0) 72.45%, #000000 99.97%), url(${({ image }) => image});
  border-radius: 16px 16px 0px 0px;
  background-size: cover;
`

const BackButton = styled(Button)`
  position: absolute;
  bottom: -20px;
  right:20px;
  background:#18E3FF;
  color:#ffffff;
  border:none;
  width:45px;
  height:45px;
`
const CardInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 16px;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  gap: 10px;
`
const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:10px;
  font-size:18px;
`
const Name = styled.div`
  white-space: nowrap;
  font-weight: 500;
  font-size: 32px;
  line-height: 48px;
  width:75%;
  height:48px;
  text-overflow: ellipsis;
  overflow: hidden;
`
const Age = styled.div`
  font-weight: 500;
  font-size: 28px;
  line-height: 42px;
`
const Text = styled.div`
font-weight: 400;
font-size: 18px;
line-height: 27px;
display: flex;
align-items: center;
`
const Subtitle = styled.div`
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  display: flex;
  align-items: center;
`
const Tags = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap:10px;
`
const Tag = styled.div`
  display: flex;
  padding: 4px 8px;
  border: 1px solid #8C8C8C;
  border-radius: 24px;
  color: #8C8C8C;
  font-size: 12px;
`


const ReportBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0px;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
`
const ProfileCardAction = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 102px;
  border-radius: 0px 0px 16px 16px;
  padding: 0px 48px;
  position:sticky;
  bottom:10px;
  
`

const profile = {
  walletAddress: "0x8dA0F34A0819fE8dbD130050a4059859241dFEfd",
  name: "Jessica Lin",
  age: '22',
  avatar: "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  bio: "一堆戴口罩是想表示重視疫情嗎？",
  gender: 'Woman'
}

const GenderIcon = ({ type }: { type: number }): JSX.Element => {
  console.log('gender:', type)
  switch (type) {
    case 0:
      return <WomanOutlined />
    case 1:
      return <ManOutlined />
    case 2:
      return <UserOutlined />
    default:
      return <UserOutlined />
  }
}
const RecommendationProfile = (props: Props) => {
  const tind3rMembershipContract = useTind3rMembershipContract()
  const userProfile = useAppSelector(state => state.application.selectedProfile) as UserProfile
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }
  const handleReport = () => {
    //todo
  }
  console.log('Selected User Profile', userProfile)
  return (
    <Layout>
      <ProfileCardContainer>
        <CardImage image={userProfile.profileBaseUri + userProfile.selectedProfileIndex.toString() + '.png'}>
          <BackButton shape='circle' icon={<ArrowDownOutlined style={{ fontSize: '24px' }} onClick={handleBack} />}></BackButton>
        </CardImage>
        <CardInfoBox>
          <InfoBox>
            <Name>{userProfile.name}</Name>
            <Age>{calculateAge(userProfile.birthday)}</Age>
          </InfoBox>
          <InfoBox>

            <GenderIcon type={userProfile.gender} />
            <div>{convertGenderToText(userProfile.gender)}</div>
          </InfoBox>

        </CardInfoBox>
        <CardInfoBox>
          <Subtitle>About Me</Subtitle>

          {userProfile.bio}
        </CardInfoBox>
        <CardInfoBox>
          <Subtitle >My Interests</Subtitle>
          <Tags>
            {userProfile?.tags?.map((tag, index) => (
              <Tag>
                Tennis
              </Tag>
            ))}
          </Tags>
        </CardInfoBox>
        <ReportBox onClick={handleReport}>
          <div style={{ fontSize: '16px' }}>REPORT {userProfile.name}</div>
        </ReportBox>
        <ProfileCardAction>
          <Button shape='circle' icon={<CloseOutlined style={{ color: "#FF5E51", fontWeight: 'bold', fontSize: '32px' }} />} style={{ width: '80px', height: '80px', background: '#ffffff', border: "none", boxShadow: '0 1px 2px 0 rgba(0,0,0,0.2)' }} />
          <Button shape='circle' icon={<StarFilled style={{ color: '#07A6FF', fontSize: '24px' }} />} style={{ width: '55px', height: '55px', background: '#ffffff', border: "none", boxShadow: '0 1px 2px 0 rgba(0,0,0,0.2)' }} />
          <Button shape='circle' icon={<HeartFilled style={{ color: '#00D387', fontSize: '32px' }} />} style={{ width: '80px', height: '80px', background: '#ffffff', border: "none", boxShadow: '0 1px 2px 0 rgba(0,0,0,0.2)' }} />
        </ProfileCardAction>
      </ProfileCardContainer>
      <HelperContent>
        <StyledButton>HIDE</StyledButton>
        <InstructionBox><BsArrowLeftSquare />PASS</InstructionBox>
        <InstructionBox><BsArrowUpSquare />SUPERLIKE</InstructionBox>
        <InstructionBox><BsArrowRightSquare />LIKE</InstructionBox>
      </HelperContent>
    </Layout>
  )
}

export default RecommendationProfile