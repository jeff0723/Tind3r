import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './ChatScreen';
import SwipeScreen from './SwipeScreen';


const Tab = createBottomTabNavigator();
type Props = {}

const MainScreen = (props: Props) => {

    return (

        < Tab.Navigator screenOptions={({ route }) => (
            {
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#18E3FF',
                tabBarInactiveTintColor: '#BFBFBF',
                tabBarIcon: ({ focused, size, color }) => {
                    if (route.name === 'Chat') {

                        return <Ionicons name='chatbubbles-sharp' size={30} color={focused ? '#18E3FF' : '#BFBFBF'} />


                    }
                    else if (route.name === 'Swipe') {
                        return <Ionicons name='chatbubble-sharp' size={30} color={focused ? '#18E3FF' : '#BFBFBF'} />

                    }

                },
                tabBarStyle: { borderTopWidth: 0 }

            }
        )}>
            <Tab.Screen name="Swipe" component={SwipeScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
        </Tab.Navigator >
    )
}


export default MainScreen