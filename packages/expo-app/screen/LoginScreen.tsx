import { StyleSheet, Text, Image, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { color } from '../constant/color'


type Props = {}

const LoginScreen = (props: Props) => {
    return (
        <SafeAreaView style={styles.body}>
            <View style={styles.none} />
            <Image source={require('../assets/logo-white.png')} />
            <View style={styles.info}>
                <Text style={styles.welcome}>Welcome</Text>
                <Text style={styles.desc}>By tapping Log In, you are going to create indentities in different services. </Text>
                <TouchableOpacity style={styles.signupButton} activeOpacity={0.7}>
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    body: {
        backgroundColor: color.primary,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: {
        flexBasis: '33%',
        flexShrink: 0,
        justifyContent: 'flex-end',
        paddingBottom: 100
    },
    none: {
        flexBasis: '33%',
        flexShrink: 0
    },
    signupButton: {
        backgroundColor: color.primary,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        color: color.white,
        borderColor: color.white,
        borderWidth: 1,
    },
    buttonText: {
        color: color.white,
        fontWeight: '700'
    },
    desc: {
        color: color.white,
        fontWeight: '700',
        marginBottom: 30,
        textAlign: 'center',
        paddingLeft: 40,
        paddingRight: 40,
        lineHeight: 18
    },
    welcome: {
        color: color.white,
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 60
    }
})