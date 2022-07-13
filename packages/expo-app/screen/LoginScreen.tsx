import { StyleSheet, Text, Image, View, SafeAreaView } from 'react-native'
import React from 'react'
import { color } from '../constant/color'


type Props = {}

const LoginScreen = (props: Props) => {
    return (
        <SafeAreaView style={styles.body}>
            <Image source={require('../assets/logo-white.png')} />
            <View style={styles.infoContainer}>
                <Text style={styles.subtitle}>Welcome</Text>
                <Text style={styles.helperText}>By tapping Sign up, you are going to create indentities in different services. </Text>
            </View>
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
    },
    infoContainer: {
        flex: 1,
        alignContent: 'center'
    },
    subtitle: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: "700",
        color: color.white
    },
    helperText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        fontWeight: "700",
        color: color.white,
        lineHeight: 21
    }
})