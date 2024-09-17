import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Colors } from "../../constants/Colors";
import { CreateTripContext } from "./../../context/CreateTripContext";

export default function SearchCurrentPlace() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext); // Context for trip data
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true, 
      headerTransparent: true, 
      headerTitle: "Search", 
    });
  }, [navigation]);

  useEffect(() => {
    console.log(tripData); // Logs the current trip data whenever it changes
  }, [tripData]);

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
          fontSize: 18,
          fontWeight: "bold",
          color: Colors.PRIMARY,
          textAlign: "center",
          marginBottom: 1,
          lineHeight: 24,
          marginTop: 40,
        }}
      >
        Choose your city to find and map the nearest airports for flight options.
      </Text>

      <GooglePlacesAutocomplete
        placeholder="Search Your Starting Place"
        fetchDetails={true}
        onPress={(data) => {
          // Logs the place description (place name)
          console.log(data.description); 

          // Updating the trip data with only the startPlace while keeping other data intact
          setTripData((prevTripData) => ({
            ...prevTripData, // Keep existing tripData (like locationInfo)
            startPlace: data.description, // Store only the place name as startPlace
          }));

          // Navigate to the next screen
          router.push("/create-trip/search-place");
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY, // Use your Google Places API key
          language: "en",
        }}
        styles={{
          textInputContainer: {
            borderWidth: 1,
            borderRadius: 5,
            marginTop: 20,
          },
        }}
      />
    </View>
  );
}
