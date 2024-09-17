import moment from "moment";
import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";
import UserTripCard from "./UserTripCard";
import { useRouter } from "expo-router";

export default function UserTripList({ userTrips }) {
  if (!userTrips || userTrips.length === 0) {
    return null; // Return early if no trips
  }

  // Reverse the trips array to show the most recent trip first
  const reversedTrips = userTrips.slice().reverse();

  // Safely parse trip data for the latest trip (now the first item in reversedTrips)
  let latestTripData;
  try {
    latestTripData = JSON.parse(reversedTrips[0]?.tripData);
  } catch (error) {
    console.error('Error parsing tripData:', error);
    return null; // Handle parsing error (if tripData is not valid JSON)
  }

  const router = useRouter();

  return (
    <View>
      <View style={{ marginTop: 20 }}>
        {latestTripData.locationInfo?.photoRef ? (
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${latestTripData.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            }}
            style={{
              width: "100%",
              height: 240,
              resizeMode: "cover", // Correctly handle image scaling
              borderRadius: 15,
            }}
          />
        ) : (
          <Image
            source={require('./../../assets/images/placeholder.png')}
            style={{
              width: "100%",
              height: 240,
              resizeMode: "cover", // Correctly handle image scaling
              borderRadius: 15,
            }}
          />
        )}
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}
          >
            {latestTripData.locationInfo?.name ? latestTripData.locationInfo.name : 'Unknown Location'}
          </Text>
          <View style={{
            flexDirection: 'row', // Correctly apply flex direction
            justifyContent: 'space-between',
            marginTop: 5,
          }}>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 17,
                color: Colors.GRAY,
              }}
            >
              {latestTripData.startDate ? moment(latestTripData.startDate).format("DD MMM YYYY") : 'No Start Date'}
            </Text>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 17,
                color: Colors.GRAY,
              }}
            >
              🚎{latestTripData.traveler?.title ? ` ${latestTripData.traveler.title}` : ' No Traveler Info'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/trip-details', params: { trip: JSON.stringify(reversedTrips[0]) } })}
            style={{
              backgroundColor: Colors.PRIMARY,
              marginTop: 10,
              borderRadius: 15,
              padding: 15,
            }}
          >
            <Text style={{
              color: Colors.WHITE,
              textAlign: 'center',
              fontFamily: 'outfit-medium',
              fontSize: 15,
            }}>
              See your plan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render all trips after the latest trip */}
        {reversedTrips.map((trip, index) => (
          <UserTripCard trip={trip} key={index} />
        ))}
      </View>
    </View>
  );
}
