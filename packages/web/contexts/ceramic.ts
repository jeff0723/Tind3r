import { createContext } from 'react'
export type CermaicContextType = {
    client: undefined
}

export const CeramicContext = createContext<CermaicContextType>({
    client: undefined,
})

export default CeramicContext