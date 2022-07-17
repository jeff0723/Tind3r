import CeramicContext, { CermaicContextType } from 'contexts/ceramic'
import { useContext } from 'react'

const useCeramic = (): CermaicContextType => {
    const context = useContext(CeramicContext)
    if (context === undefined) {
        throw new Error('useCeramic must be used within an XmtpProvider')
    }
    return context
}

export default useCeramic
