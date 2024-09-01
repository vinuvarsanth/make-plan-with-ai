import { View, Text, Image } from 'react-native';
import React from 'react';
import moment from 'moment';
import { Colors } from '../../constants/Colors';

export default function UserTripCard({ trip }) {
  // Function to parse the trip data safely
  const formatData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing trip data:', error);
      return {};
    }
  };

  // Ensure trip data is parsed correctly
  const parsedTripData = formatData(trip.tripData);

  // Accessing data from tripPlan
  const location = trip?.tripPlan?.trip?.destination || 'Unknown Location';
  const startDate = parsedTripData.startDate ? moment(parsedTripData.startDate).format("DD MMM YYYY") : 'No Start Date';
  const traveler = parsedTripData.traveler?.title || 'No Traveler Info';

  return (
    <View style={{
      marginTop: 20,
      display:'flex',
      gap:10,
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      {/* <Image
        source={require('./../../assets/images/placeholder.png')}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15
        }}
      /> */}
      <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${formatData(trip.tripData).locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            }}
            style={{
                width: 100,
                height: 100,
                borderRadius: 15
            }}
          />

      <View style={{ marginLeft: 10 }}>
        <Text style={{
          fontFamily: 'outfit-medium',
          fontSize: 18,
        }}>
          {location}
        </Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 14,
          color: Colors.GRAY
        }}>
          {startDate}
        </Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 14,
          color: Colors.GRAY
        }}>
          Traveling: 🚎{' '}{traveler}
        </Text>
      </View>
    </View>
  );
}
