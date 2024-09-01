import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Colors } from "../../constants/Colors";
import moment from "moment/moment";
import { CreateTripContext } from "../../context/CreateTripContext";
export default function SelectDates() {
  const navigation = useNavigation();
  const [startDate,setStartDate] = useState();
  const [endDate,setEndtDate] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const onDateChange = (date, type) => {
    console.log(date,type);
    if(type=='START_DATE')
    {
        setStartDate(moment(date))
    }
    else
    {
        setEndtDate(moment(date))
    }
  };
  const OnDateSelectionContinue = () => {
    if(!startDate && !endDate)
    {
        ToastAndroid.show('Please select Start and End Date',ToastAndroid.LONG)
        return ;
    }
    const totalNoOfDays =endDate.diff(startDate,'days');
    console.log(totalNoOfDays+1);
    setTripData({
        ...tripData,
        startDate:startDate,
        endDate:endDate,
        totalNoOfDays:totalNoOfDays+1
    });
    router.push('/create-trip/select-budget')
  }
  useEffect(() => {
    navigation.setOptions({
      headerShown: true, // Correct property to show the header
      headerTransparent: true, // Makes the header transparent
      headerTitle: "", // Sets the header title
    });
  }, [navigation]);

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 35,
          marginTop: 20,
        }}
      >
        Travel Dates
      </Text>
      <View
        style={{
          marginTop: 35,
        }}
      >
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          maxRangeDuration={5}
          selectedRangeStyle={{
            backgroundColor: Colors.PRIMARY,
          }}
          selectedDayTextStyle={{
            color: Colors.WHITE,
          }}
        />
      </View>
      <TouchableOpacity
        onPress={OnDateSelectionContinue}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontFamily: "outfit",
            fontSize: 20,
            textAlign: "center", // Centering the text
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
