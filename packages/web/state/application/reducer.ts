import { createSlice } from '@reduxjs/toolkit'
import { ConnectionType } from 'connection'
import { UserProfile, MatchProfile } from 'schema/ceramic/user'

export interface ApplicationState {
    recommendationList?: UserProfile[],
    selectedProfile?: UserProfile,
    matchList?: MatchProfile[]
}
export const initialState: ApplicationState = {
    recommendationList: [],
    selectedProfile: {
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
    },
    matchList: []

}

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        updateRecommedationList(state, { payload: { recommendationList } }) {
            state.recommendationList = recommendationList
        },
        updateSelectedProfile(state, { payload: { selectedProfile } }) {
            state.selectedProfile = selectedProfile
        },
        updateMatchList(state, { payload: { matchList } }) {
            state.matchList = matchList
        }
    }
})

export const {
    updateRecommedationList,
    updateSelectedProfile,
    updateMatchList
} = applicationSlice.actions
export default applicationSlice.reducer