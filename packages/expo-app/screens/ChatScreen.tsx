import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/UI/Header'
type Props = {}

const ChatScreen = (props: Props) => {
    return (
        <View style={styles.body}>
            <Header />

        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#fff',
        flex: 1
    }
})