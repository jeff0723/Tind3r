import { SupportedChainId } from "./chains"


type AddressMap = { [chainId: number]: string }

export const TIND3R_MEMBER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON_MUMBAI]: "0xa6D514ceE32d661CAEd3A7415acEa98B717f698e"
}
