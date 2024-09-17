import React, { useContext, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { CreateTripContext } from "../../context/CreateTripContext";
import { AI_PROMPT } from "../../constants/Options";
import { chatSession } from "../../configs/AiModal";
import { useRouter } from "expo-router";
import { auth,db } from './../../configs/FirebaseConfig'
import { doc, setDoc } from "firebase/firestore";
export default function GenerateTrip() {

  const { tripData, setTripData } = useContext(CreateTripContext);

  const [ loading, setLoading ] = useState(false);

  const router = useRouter();

  const user = auth.currentUser;

  useEffect(()=>{
    GenerateAiTrip()
  },[])
  const GenerateAiTrip=async()=>{
    setLoading(true);
    const FINAL_PROMPT=AI_PROMPT
    .replace('{location}',tripData?.locationInfo?.name)
    .replace('{startPlace}', tripData?.startPlace)  // Adding start place
    .replace('{totalDays}',tripData.totalNoOfDays)
    .replace('{totalNight}',tripData.totalNoOfDays-1)
    .replace('{totalNight}',tripData.totalNoOfDays-1)
    .replace('{traveler}',tripData.traveler?.title)
    .replace('{budget}',tripData.budget)
    .replace('{totalDay}',tripData.totalNoOfDays)
    .replace('{totalNight}',tripData.totalNoOfDays-1);
    console.log(FINAL_PROMPT);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result.response.text());
    const tripResp =JSON.parse(result.response.text());

    setLoading(false)

    const docId = (Date.now()).toString();
    const result_=await setDoc(doc(db,"UserTrips",docId),{
        userEmail:user.email,
        tripPlan:tripResp,
        tripData:JSON.stringify(tripData),
        docId:docId
    })
        router.push('(tabs)/mytrip');
    
  }
  return (
    <View style={{
        padding:25,
        paddingTop:75,
        backgroundColor:Colors.WHITE,
        height:'100%'
    }}>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:35,
        textAlign:'center'
      }}
      >
        Please Wait....
      </Text>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 23,
          textAlign: "center",
          marginTop: 40,
          color:Colors.GRAY
        }}
      >
        We are Working to generate your dream trip
      </Text>
      <Image
        source={require("./../../assets/images/plane.gif")}
        style={{
          width: "100%",
          height: 400,
          resizeMode: "contain",
          alignSelf: "center",
        }}
      />
      <Text
        style={{
          fontFamily: "outfit",
          color: Colors.GRAY,
          fontSize: 20,
          textAlign: "center",
        }}
      >
        Don't Go Back...
      </Text>
    </View>
  );
}
