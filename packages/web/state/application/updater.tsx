import { useWeb3React } from '@web3-react/core'
import useCeramic from 'hooks/useCeramic'
import { useTind3rMembershipContract } from 'hooks/useContract'

import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { UserProfile, MatchProfile } from 'schema/ceramic/user'

import { updateRecommedationList, updateSelectedProfile, updateMatchList } from './reducer'
import config from 'schema/ceramic/model.json';
import { openNotificationWithIcon } from 'utils/notification'
import { useRouter } from 'next/router'


const queryUserInfoListFromTableland = async (startId: number, endId: number): Promise<string[][]> => {
    const TABLELAND_PREFIX = "https://testnet.tableland.network/query?s=SELECT+description,owner+FROM+tind3r_membership_80001_452+where+"
    const queryURL = TABLELAND_PREFIX + `id>=${startId}+and+id<${endId}`;
    const content = await fetch(queryURL)
    const object = await content.json()
    return object.rows
}
const queryUserInfoFromTableland = async (userIdList: number[]): Promise<string[][]> => {
    const TABLELAND_PREFIX = "https://testnet.tableland.network/query?s=SELECT+description,owner+FROM+tind3r_membership_80001_452+where+id+in+"
    const queryURL = TABLELAND_PREFIX + `(${userIdList.join(',')})`;
    const content = await fetch(queryURL)
    const object = await content.json()
    return object.rows
}

export default function Updater(): null {
    const { account } = useWeb3React()
    const { ceramic } = useCeramic();
    const dispatch = useAppDispatch()
    const router = useRouter()
    const isMembershipCreated = useAppSelector(state => state.user.isMembershipCreated)
    const tind3rMembershipContract = useTind3rMembershipContract()


    const getRecProfileList = useCallback(async () => {
        if (!ceramic || !account) return
        const userInfoList = await queryUserInfoListFromTableland(0, 100)
        if (userInfoList.length == 0) return
        // @ts-ignore
        const userInfoMap = new Map<string, string>(userInfoList)
        const streamIdList = Array(...userInfoMap.keys())
        const queryList = streamIdList.map(sid => { return { streamId: sid } })
        const streamRecord = await ceramic.multiQuery(queryList)
        const recProfileList: UserProfile[] = Object.values(streamRecord).map((stream) => {
            return {
                ...stream.content,
                walletAddress: userInfoMap.get(stream.id.toString())
            }
        })
        const _recommendProfileList = recProfileList.filter((profile) => profile.walletAddress !== account?.toLocaleLowerCase())
        dispatch(updateRecommedationList({ recommendationList: _recommendProfileList }))
    }, [ceramic, account])

    const getMatchedProfileList = useCallback(async () => {
        if (!ceramic || !tind3rMembershipContract || !account) return
        try {
            const userIdList = await tind3rMembershipContract.getMatches(account)
            if (userIdList.length == 0) return
            const userInfoList = await queryUserInfoFromTableland(userIdList)
            // @ts-ignore
            const userInfoMap = new Map<string, string>(userInfoList)
            console.log(userInfoMap)
            const streamIdList = Array(...userInfoMap.keys())
            const queryList = streamIdList.map(sid => { return { streamId: sid } })
            const streamRecord = await ceramic.multiQuery(queryList)
            const _matchList: MatchProfile[] = Object.values(streamRecord).map((stream) => {
                return {
                    ...stream.content,
                    walletAddress: userInfoMap.get(stream.id.toString()),
                    lastMessage: "hi",
                }
            })
            dispatch(updateMatchList({ matchList: _matchList }))
        } catch (error) {
            openNotificationWithIcon('error', 'Error', error.message)
        }
    }, [ceramic, tind3rMembershipContract, account])

    useEffect(() => {
        getRecProfileList()
        getMatchedProfileList()

    }, [dispatch, account, ceramic, tind3rMembershipContract])
    return null
}
