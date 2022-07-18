import CeramicProvider from "providers/CeramicProvider"
import MiniXtmpProvider from "providers/MiniXtmpProvider"
import { WalletProvider } from "providers/WalletProvider"
import XmtpProvider from "providers/XmtpProvider"
import { Provider } from 'react-redux'
import store from "state"

type AppProps = {
    children?: React.ReactNode
}


function App({ children }: AppProps) {
    return (
        <WalletProvider>
            <CeramicProvider>
                <XmtpProvider>
                    <Provider store={store}>
                        {children}
                    </Provider>
                </XmtpProvider>
            </CeramicProvider>
        </WalletProvider>

    )
}

export default App
