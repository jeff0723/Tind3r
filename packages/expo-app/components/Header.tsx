import React from 'react'
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'

type Props = {}

// user profile shoudl query-able by useContect or redux global states
const user = {
    image: "https://images-ssl.gotinder.com/5ee799d5922dd40100af4bc5/640x800_75_5be828f1-d5d5-4ba4-9b78-dbeaab399ab3.webp"
}
const Header = (props: Props) => {
    return (
        <SafeAreaView>
            <View>
                <TouchableOpacity>
                    <Image style={styles.profileLogo} source={{ uri: user.image }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={styles.logo} source={require('../assets/logo-blue.png')} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default Header

const styles = StyleSheet.create({
    profileLogo: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        top: 5,
        left: 30,
        position: 'absolute'
    },
    logo: {
        width: 109,
        height: 23,
        position: "absolute",
        top: 15,
        left: '37.5%'
    }

})