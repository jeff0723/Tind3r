import { SupportedChainId } from "./chains"


type AddressMap = { [chainId: number]: string }

export const TIND3R_MEMBER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON_MUMBAI]: "0x9bc7C2CC790aA34eB72FAebd1AD2066BB194fC88"
}
