import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Colors } from "../../constants/Colors";

export default function SearchPlace() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true, // Correct property to show the header
      headerTransparent: true, // Makes the header transparent
      headerTitle: "Search", // Sets the header title
    });
  }, [navigation]); // Adding navigation to dependency array for best practices

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data.description); // Logs the description of the place
          console.log(details?.geometry?.location); // Logs the location geometry (latitude and longitude)
          console.log(details?.photos[0]?.photo_reference); // Logs the photo reference of the first photo
          console.log(details?.url); // Logs the URL of the place
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY, // Replace 'YOUR_API_KEY' with your actual Google Places API key
          language: "en",
        }}
      />
    </View>
  );
}
