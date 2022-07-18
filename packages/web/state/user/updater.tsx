import { createSlice } from '@reduxjs/toolkit'
export interface UserState {
    userName: string
}
export const initialState: UserState = {
    userName: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserName(state, { payload: { userName } }) {
            state.userName = userName
        }
    }
})

export const {
    updateUserName
} = userSlice.actions
export default userSlice.reducer