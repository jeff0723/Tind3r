import { useWeb3React } from '@web3-react/core'
import useCeramic from 'hooks/useCeramic'
import { useTind3rMembershipContract } from 'hooks/useContract'

import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'

import { updateIsCeramicProfileExists, updateMembershipCreated, updateUserProfile } from './reducer'
import config from 'schema/ceramic/model.json';

const UserProfileDefinitionId = config.definitions.UserProfile


export default function Updater(): null {
    const { account, provider } = useWeb3React()
    const { idx, isAuthenticated } = useCeramic()
    const tind3rMembershipContract = useTind3rMembershipContract()
    const dispatch = useAppDispatch()

    const checkUserProfileExists = useCallback(async () => {
        if (idx && idx.authenticated) {
            idx.get(UserProfileDefinitionId, `${account}@eip155:1`).then(res => {
                if (res) {
                    dispatch(updateIsCeramicProfileExists({ isCeramicProfileExists: true }))
                    dispatch(updateUserProfile({ userProfile: res }))
                } else {
                    dispatch(updateIsCeramicProfileExists({ isCeramicProfileExists: false }))
                }
            })
                .catch(err => console.log(err))


        }
    }, [account, idx, isAuthenticated])
    const checkMembershipExists = useCallback(async () => {
        if (account && provider && tind3rMembershipContract) {
            const isExists = await tind3rMembershipContract.isTind3rMember(account)
            dispatch(updateMembershipCreated({ isMembershipCreated: isExists }))
        }
    }, [account, tind3rMembershipContract, provider])

    useEffect(() => {
        checkMembershipExists()
    }, [dispatch, account, provider, tind3rMembershipContract])

    useEffect(() => {
        checkUserProfileExists()
    }, [dispatch, account, idx, isAuthenticated])



    return null
}
