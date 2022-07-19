import CeramicProvider from "providers/CeramicProvider"
import MiniXtmpProvider from "providers/MiniXtmpProvider"
import { WalletProvider } from "providers/WalletProvider"
import Web3Provider from "providers/Web3Provider"
import XmtpProvider from "providers/XmtpProvider"
import { Provider } from 'react-redux'
import store from "state"
import UserUpdater from 'state/user/updater'
type AppProps = {
    children?: React.ReactNode
}
function Updaters() {
    return (
        <>
            <UserUpdater />
        </>
    )
}

function App({ children }: AppProps) {
    return (
        <Provider store={store}>
            <Web3Provider>
                <CeramicProvider>
                    {/* <XmtpProvider> */}
                    <Updaters />
                    {children}
                    {/* </XmtpProvider> */}
                </CeramicProvider>
            </Web3Provider>
        </Provider>

    )
}

export default App
