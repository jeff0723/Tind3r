import CeramicProvider from "providers/CeramicProvider"
import MiniXtmpProvider from "providers/MiniXtmpProvider"
import { WalletProvider } from "providers/WalletProvider"
import XmtpProvider from "providers/XmtpProvider"

type AppProps = {
    children?: React.ReactNode
}


function App({ children }: AppProps) {
    return (
        <WalletProvider>
            <XmtpProvider>
                <CeramicProvider>
                    {children}
                </CeramicProvider>
            </XmtpProvider>
        </WalletProvider>

    )
}

export default App
