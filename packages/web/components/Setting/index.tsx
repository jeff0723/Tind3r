import React from 'react'
import styled from 'styled-components'
import { FaStoreAlt } from "react-icons/fa";
import Icon from '@ant-design/icons/lib/components/AntdIcon';
import Image from 'next/image';
import { HomeFilled } from '@ant-design/icons';

type Props = {}

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px;
  gap: 10px;
  width: 100%;
  height: 86px;
  background: linear-gradient(90deg, #18E3FF 0%, #18FFAC 100%);
`
const IconBox = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #000;
  opacity:0.52;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Setting = (props: Props) => {
    return (
        <div>
            <Header>
                <IconBox>
                    {/* should change to logo */}
                    <HomeFilled style={{ color: "#fff", fontSize: '22px' }} />
                </IconBox>

                <IconBox>
                    <FaStoreAlt style={{ color: "#fff", width: '22px', height: '20px' }} />
                </IconBox>

            </Header>
            <div>
                Account Info
            </div>
        </div>
    )
}

export default Setting