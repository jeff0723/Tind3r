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
                {children}
            </XmtpProvider>
        </WalletProvider>

    )
}

export default App
