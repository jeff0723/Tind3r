import { CeramicClient } from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { createContext } from 'react'

export type CermaicContextType = {
    ceramic: undefined | CeramicClient,
    idx: undefined | IDX,
    isAuthenticated: boolean
    signIn: () => void,

}

export const CeramicContext = createContext<CermaicContextType>({
    ceramic: undefined,
    idx: undefined,
    isAuthenticated: false,
    signIn: () => undefined,
})

export default CeramicContext