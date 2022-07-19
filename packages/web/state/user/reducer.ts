import { createSlice } from '@reduxjs/toolkit'
import { ConnectionType } from 'connection'

export interface UserState {
    userName: string
    selectedWalletBackfilled: boolean
    selectedWallet?: ConnectionType
    isProfileExists: boolean
    isCeramicAuthenticated: boolean
    isXmtpAuthenticated: boolean
}
export const initialState: UserState = {
    userName: '',
    selectedWalletBackfilled: false,
    selectedWallet: undefined,
    isProfileExists: false,
    isCeramicAuthenticated: false,
    isXmtpAuthenticated: false,

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
        }
    }
})

export const {
    updateUserName,
    updateSelectedWallet,
    updateCeramicAuthentication,
    updateXmtpAuthentication,
    updateIsProfileExists
} = userSlice.actions
export default userSlice.reducer