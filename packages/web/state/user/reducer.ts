import { createSlice } from '@reduxjs/toolkit'
import { ConnectionType } from 'connection'

export interface UserState {
    userName: string
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
    updateMembershipCreated
} = userSlice.actions
export default userSlice.reducer