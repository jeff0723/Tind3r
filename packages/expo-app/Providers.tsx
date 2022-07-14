import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./global";

import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform } from "react-native";

interface ProvidersProps {
    readonly children: JSX.Element;
}


const SCHEME_FROM_APP_JSON = "tind3r";
export default function Provider({ children }: ProvidersProps) {
    return (
        <WalletConnectProvider
            redirectUrl={
                Platform.OS === "web"
                    ? window.location.origin
                    : `${SCHEME_FROM_APP_JSON}://`
            }
            storageOptions={{
                //@ts-ignore
                asyncStorage: AsyncStorage,
            }}
        >
        </WalletConnectProvider>
    )
}