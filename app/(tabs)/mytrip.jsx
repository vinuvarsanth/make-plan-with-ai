import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants/Colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
export default function Mytrip() {

  const[userTrips,setUserTrips]=useState([]);

  
  return (
    <View style={{
      padding:25,
      paddingTop:55,
      backgroundColor:Colors.WHITE,
      height:'100%'
    }}>
      <View
      style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
      }}>
        <Text style={{
          fontFamily:'outfit-bold',
          fontSize:35
        }}>My Trip</Text>
        <MaterialIcons name="add-circle-outline" size={35} color="black" />
      </View>
      {userTrips?.length==0?
        <StartNewTripCard/>
        :null
      }
    </View>
  )
}