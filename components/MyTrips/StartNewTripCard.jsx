import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
export default function StartNewTripCard() {
  const router = useRouter();
  return (
    <View style={{
        padding:20,
        marginTop:50,
        display:'flex',
        alignItems:'center',
        gap:25
    }}>
      <MaterialIcons name="location-on" size={49} color="black" />
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:25
      }}>No Trips Planned Yet</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:20,
        textAlign:'center',
        color:Colors.GRAY
      }}>Looks like it's time to plan your next travel adventure! Let’s dive in and create an unforgettable experience together.</Text>
    <TouchableOpacity
    onPress={()=>router.push('/create-trip/search-place')}
    style={{
        padding:19,
        backgroundColor:Colors.PRIMARY,
        borderRadius:25,
        paddingHorizontal:50
    }}>
        <Text style={{
            color:Colors.WHITE,
            fontFamily:'outfit-medium',
            fontSize:20
        }}>Start New Trip</Text>
    </TouchableOpacity>
    </View>
  )
}