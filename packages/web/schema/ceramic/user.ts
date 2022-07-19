export type BasicProfile = {
    name?: string;
    birthday?: number;
    gender?: number; //0 women 1 men 2 everyone
    showMe?: string; //0 women 1 men 2 everyone 
    showMyGenderOnProfile?: boolean;
    importNFT?: boolean;
    addOnChainActivity?: boolean;
    organizations?: string[];
    passion?: string[];

}