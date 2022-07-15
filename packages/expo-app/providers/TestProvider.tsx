import { StyleSheet, Text, View } from 'react-native'
import React, { Children } from 'react'

interface Props {
    children: React.ReactNode;
}

const TestProvider = ({ children }: Props) => {
    return (
        <View style={styles.container}>
            <Text>provider hi</Text>
            <Text>My provider hi</Text>
            {children}
        </View>
    )
}

export default TestProvider

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
