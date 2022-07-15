import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { color } from '../constant/color'
import { useNavigation } from '@react-navigation/native'
import { useWalletConnect } from '@walletconnect/react-native-dapp'

type Props = {}

const ProfileScreen = (props: Props) => {
    const navigation = useNavigation<any>()
    const connector = useWalletConnect();

    const killSession = useCallback(() => {
        return connector.killSession();
    }, [connector]);
    const handleLogout = () => {
        killSession()
    }
    return (
        <SafeAreaView>
            <View >
                <TouchableOpacity style={styles.button} onPress={killSession}>
                    <Text style={styles.buttonText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 63,
        margin: 32,
        borderRadius: 32,
        borderColor: color.grey
    },

    buttonText: {
        color: color.primary,
        fontWeight: '700'
    },
})