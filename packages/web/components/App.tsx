import CeramicProvider from "providers/CeramicProvider"
import MiniXtmpProvider from "providers/MiniXtmpProvider"
import { WalletProvider } from "providers/WalletProvider"
import Web3Provider from "providers/Web3Provider"
import XmtpProvider from "providers/XmtpProvider"
import { Provider } from 'react-redux'
import store from "state"

type AppProps = {
    children?: React.ReactNode
}


function App({ children }: AppProps) {
    return (
        <Provider store={store}>
            <Web3Provider>
                {/* <CeramicProvider> */}
                {/* <XmtpProvider> */}
                {children}
                {/* </XmtpProvider> */}
                {/* </CeramicProvider> */}
            </Web3Provider>
        </Provider>

    )
}

export default App
