export type BasicProfile = {
    name?: string;

}
export type UserProfile = {
    name: string;
    birthday: number;
    bio: string;
    gender: number; //0 women 1 men 2 everyone
    showMe: number; //0 women 1 men 2 everyone 
    showMyGenderOnProfile?: boolean;
    importNFT?: boolean;
    addOnChainActivity?: boolean;
    organizations?: string[];
    tags?: string[];
}