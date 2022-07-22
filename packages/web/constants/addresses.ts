import { SupportedChainId } from "./chains"


type AddressMap = { [chainId: number]: string }

export const TIND3R_MEMBER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON_MUMBAI]: "0x25C1997843d424Be3d87Dd471FdfD50C14A0B8a5"
}
