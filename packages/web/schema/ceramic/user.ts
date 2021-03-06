export type BasicProfile = {
    name?: string;

}
export type UserProfile = {
    name: string;
    birthday: string;
    bio?: string; // max 600 words
    gender: number; //0 women 1 men 2 everyone
    showMe: number; //0 women 1 men 2 everyone 
    showMyGenderOnProfile?: boolean;
    importNFT?: boolean;
    addOnChainActivity?: boolean;
    organizations?: string[];
    tags?: string[];
    profileBaseUri: string;
    profilePictureCounts: number;
    selectedProfileIndex: number;
    walletAddress?: string;
}
export type MatchProfile = {
    name: string;
    birthday: string;
    bio?: string; // max 600 words
    gender: number; //0 women 1 men 2 everyone
    showMe: number; //0 women 1 men 2 everyone 
    showMyGenderOnProfile?: boolean;
    importNFT?: boolean;
    addOnChainActivity?: boolean;
    organizations?: string[];
    tags?: string[];
    profileBaseUri: string;
    profilePictureCounts: number;
    selectedProfileIndex: number;
    walletAddress?: string;
    lastMessage?: string;
}