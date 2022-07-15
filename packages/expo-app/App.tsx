import "./global";

import * as React from "react";
import { StyleSheet } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import "./global";

import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import { Platform } from "react-native";

import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from "./screens/ProfileScreen";
import ErrorBoundary from "./providers/ErrorBoundary";
const SCHEME_FROM_APP_JSON = "tind3r";

const Stack = createNativeStackNavigator();

export default function App() {
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}
          initialRouteName='Main'>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </WalletConnectProvider>

  );
}

// export default function AppWithProvider() {
//   return (
//     // <ErrorBoundary>
//     /* </ErrorBoundary> */
//     <App />
//   )

// }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
