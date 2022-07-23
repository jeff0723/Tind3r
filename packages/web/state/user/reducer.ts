import { createSlice } from '@reduxjs/toolkit'
import { ConnectionType } from 'connection'
import { UserProfile } from 'schema/ceramic/user'

export interface UserState {
    userName: string
    userProfile: UserProfile
    selectedWalletBackfilled: boolean
    selectedWallet?: ConnectionType
    isProfileExists: boolean
    isCeramicProfileExists: boolean
    isCeramicAuthenticated: boolean
    isXmtpAuthenticated: boolean
    isMembershipCreated: boolean
}
export const initialState: UserState = {
    userName: '',
    selectedWalletBackfilled: false,
    userProfile: {
        name: '',
        birthday: '',
        bio: '',
        gender: 0, //0 women 1 men 2 everyone
        showMe: 0, //0 women 1 men 2 everyone 
        showMyGenderOnProfile: false,
        importNFT: false,
        addOnChainActivity: false,
        organizations: [],
        tags: [],
        profileBaseUri: "",
        profilePictureCounts: 0,
        selectedProfileIndex: 0,
        walletAddress: ""
    },
    selectedWallet: undefined,
    isProfileExists: false,
    isCeramicProfileExists: false,
    isCeramicAuthenticated: false,
    isXmtpAuthenticated: false,
    isMembershipCreated: false

}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserName(state, { payload: { userName } }) {
            state.userName = userName
        },
        updateSelectedWallet(state, { payload: { wallet } }) {
            state.selectedWallet = wallet
            state.selectedWalletBackfilled = true
        },
        updateCeramicAuthentication(state, { payload: { isCeramicAuthenticated } }) {
            state.isCeramicAuthenticated = isCeramicAuthenticated
        },
        updateXmtpAuthentication(state, { payload: { isXmtpAuthenticated } }) {
            state.isXmtpAuthenticated = isXmtpAuthenticated
        },
        updateIsProfileExists(state, { payload: { isProfileExists } }) {
            state.isProfileExists = isProfileExists
        },
        updateIsCeramicProfileExists(state, { payload: { isCeramicProfileExists } }) {
            state.isCeramicProfileExists = isCeramicProfileExists
        },
        updateMembershipCreated(state, { payload: { isMembershipCreated } }) {
            state.isMembershipCreated = isMembershipCreated
        },
        updateUserProfile(state, { payload: { userProfile } }) {
            state.userProfile = userProfile
        }
    }
})

export const {
    updateUserName,
    updateSelectedWallet,
    updateCeramicAuthentication,
    updateXmtpAuthentication,
    updateIsProfileExists,
    updateIsCeramicProfileExists,
    updateMembershipCreated,
    updateUserProfile
} = userSlice.actions
export default userSlice.reducer