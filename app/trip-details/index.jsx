import { useLocalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import FlightInfo from "../../components/TripDetails/FlightInfo";
import HotelList from "../../components/TripDetails/HotelList";
import PlannedTrip from "../../components/TripDetails/PlannedTrip";
import { Colors } from "../../constants/Colors";

export default function TripDetails() {
  const navigation = useNavigation();
  const { trip } = useLocalSearchParams();
  const [TripDetails, setTripDetails] = useState({});

  const formatData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing trip data:", error);
      return {};
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });

    if (trip) {
      setTripDetails(formatData(trip));
    }
  }, [navigation, trip]);

  const tripData = TripDetails?.tripData
    ? formatData(TripDetails.tripData)
    : null;
  const flightData = TripDetails?.tripPlan?.flight;
  const hotelList = TripDetails?.tripPlan?.hotel;
  const details = TripDetails?.tripPlan?.places_to_visit;
  const dailyPlan = TripDetails?.tripPlan?.daily_plan; // Add this

  

  return (
    tripData && (
      <ScrollView style={styles.container}>
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripData?.locationInfo?.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
          }}
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.locationName}>
            {tripData?.locationInfo?.name}
          </Text>
          <Text style={styles.travelerText}>
            <Text>🚎</Text>
            {tripData.traveler?.title
              ? ` ${tripData.traveler.title}`
              : " No Traveler Info"}
          </Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {moment(tripData.startDate).format("DD MMM yyyy")}
            </Text>
            <Text style={styles.dateText}>
              - {moment(tripData.endDate).format("DD MMM yyyy")}
            </Text>
            <Text style={styles.dateText}>
              {"( "}{tripData.totalNoOfDays} days{" )"}
            </Text>
          </View>
          <FlightInfo flightData={flightData} />
          <HotelList hotelList={hotelList} />
          <PlannedTrip details={details} dailyPlan={dailyPlan} />
        </View>
      </ScrollView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: "100%",
    height: 330,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: "100%",
  },
  locationName: {
    fontFamily: "outfit-bold",
    fontSize: 25,
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  dateText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
  travelerText: {
    fontFamily: "outfit",
    fontSize: 20,
    color: Colors.GRAY,
    marginTop: 2,
  },
});
