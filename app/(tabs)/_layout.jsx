import { Tabs } from 'expo-router'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import {Colors} from './../../constants/Colors'
import Entypo from '@expo/vector-icons/Entypo';
export default function _layout() {
  return (
    <Tabs screenOptions={{
      headerShown:false,
      tabBarActiveTintColor:Colors.PRIMARY
    }}>
        <Tabs.Screen name="mytrip"
          options={{
            tabBarLabel:'My Trip',
            tabBarIcon:({color})=><Entypo name="location" size={24} color={color} />
          }}
          />
        <Tabs.Screen name="discover"
          options={{
          tabBarLabel:'Discover',
          tabBarIcon:({color})=><Fontisto name="world" size={24} color={color} />
        }}/>
        <Tabs.Screen name="profile"
          options={{
            tabBarLabel:'Profile',
            tabBarIcon:({color})=><Ionicons name="people-circle" size={24} color={color} />
          }}/>
    </Tabs>
  )
}
