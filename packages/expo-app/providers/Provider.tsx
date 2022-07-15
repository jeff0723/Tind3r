// import "./global";

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import { Platform } from "react-native";
const SCHEME_FROM_APP_JSON = "tind3r";


const Provider = ({ children }: { children: JSX.Element }) => {
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
      {children}
    </WalletConnectProvider>

  )
}

export default Provider

const styles = StyleSheet.create({})