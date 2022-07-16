import MiniXtmpProvider from "../providers/MiniXtmpProvider"
import { WalletProvider } from "../providers/WalletProvider"

type AppProps = {
    children?: React.ReactNode
}

function App({ children }: AppProps) {
    return (
        <WalletProvider>
            <MiniXtmpProvider>
                {children}
            </MiniXtmpProvider>
        </WalletProvider>

    )
}

export default App
