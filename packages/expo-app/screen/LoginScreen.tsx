import { StyleSheet, Text, Image, View, SafeAreaView } from 'react-native'
import React from 'react'
import { color } from '../constant/color'


type Props = {}

const LoginScreen = (props: Props) => {
    return (
        <SafeAreaView style={styles.body}>
            <Image source={require('../assets/logo-white.png')} />
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    body: {
        backgroundColor: color.primary,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})