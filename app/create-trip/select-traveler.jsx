import { View, Text, FlatList, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { SelectTravelerList } from './../../constants/Options/';
import OptionCard from '../../components/CreateTrip/OptionCard';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function SelectTraveler() {
  const navigation = useNavigation();
  const router = useRouter(); // Using the router from expo-router
  const { tripData, setTripData } = useContext(CreateTripContext);

  const [selectedTraveler, setSelectedTraveler] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);

  useEffect(() => {
    setTripData({
      ...tripData,
      traveler: selectedTraveler,
    });
  }, [selectedTraveler, setTripData]); // Ensure setTripData is in the dependency array

  useEffect(() => {
    console.log(tripData);
  }, [tripData]);

  const onTravelerSelectionContinue = () => {
    if (!selectedTraveler) {
      ToastAndroid.show('Please select a traveler', ToastAndroid.LONG);
      return;
    }
    router.push('/create-trip/select-dates');
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: '100%',
      }}
    >
      <Text
        style={{
          fontSize: 35,
          fontFamily: 'outfit-bold',
          marginTop: 20,
        }}
      >
        Who's Traveling
      </Text>
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 23,
          }}
        >
          Choose your travelers
        </Text>

        <FlatList
          data={SelectTravelerList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedTraveler(item)}
              style={{
                marginVertical: 10,
              }}
            >
              <OptionCard option={item} selectedTraveler={selectedTraveler} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()} // Added a keyExtractor for better performance
        />
      </View>

      <TouchableOpacity
        onPress={onTravelerSelectionContinue} // Use the new function
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
            fontFamily: 'outfit',
            fontSize: 20,
            textAlign: 'center', // Centering the text
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
