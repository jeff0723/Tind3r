import { CeramicClient } from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { createContext } from 'react'

export type CermaicContextType = {
    ceramic: undefined | CeramicClient,
    idx: undefined | IDX
}

export const CeramicContext = createContext<CermaicContextType>({
    ceramic: undefined,
    idx: undefined,
})

export default CeramicContext