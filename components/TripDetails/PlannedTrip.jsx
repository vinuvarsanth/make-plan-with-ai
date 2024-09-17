import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

// Function to search for place id from Google Places API by place name
const searchPlaceId = async (placeName) => {
  try {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName)}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
    );
    const result = await resp.json();
    return result.results[0]?.place_id;
  } catch (error) {
    console.error('Error searching place id:', error);
    return null;
  }
};

// Function to fetch photo reference from Google Places API using place id
const getPhotoRef = async (placeId) => {
  try {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
    );
    const result = await resp.json();
    return result.result?.photos[0]?.photo_reference;
  } catch (error) {
    console.error('Error fetching photo reference:', error);
    return null;
  }
};

const PlacesToVisit = ({ details, dailyPlan }) => {
  const [placeImages, setPlaceImages] = useState([]);

  useEffect(() => {
    const fetchPlaceImages = async () => {
      try {
        const imagePromises = details.map(async (place) => {
          const placeId = await searchPlaceId(place.name);
          if (placeId) {
            const photoReference = await getPhotoRef(placeId);
            return photoReference ? getPhotoUrl(photoReference) : null;
          }
          return null;
        });

        const imageUrls = await Promise.all(imagePromises);
        setPlaceImages(imageUrls.filter(url => url)); // Remove null values
      } catch (error) {
        console.error('Error fetching place images:', error);
      }
    };

    fetchPlaceImages();
  }, [details]);

  const getPhotoUrl = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`;
  };

  if (!details || details.length === 0) return <Text>No Places Available</Text>;

  return (
    <View style={styles.container}>
      {/* Places to Visit Section */}
      <Text style={styles.placesTitle}>📌 Places to Visit</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {details.map((place, index) => (
          <View key={index} style={styles.placeCard}>
            <Image source={{ uri: placeImages[index] }} style={styles.placeImage} />
            <View style={styles.placeDetails}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeDescription}>{place.details}</Text>
              <Text style={styles.placeInfo}>
                <FontAwesome name="clock-o" size={14} color={Colors.GRAY} /> {place.time_to_travel}
              </Text>
              <Text style={styles.placeInfo}>
                <FontAwesome name="ticket" size={14} color={Colors.GRAY} /> {place.ticket_pricing}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Day-wise Plan Section */}
      <Text style={styles.planTitle}>🌏 Daily Plan</Text>
      <ScrollView>
        {dailyPlan?.map((dayPlan, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>Day {dayPlan.day}: {dayPlan.description}</Text>
            {dayPlan.schedule.map((activity, i) => (
              <Text key={i} style={styles.activityText}>
                ⏰ {activity.time} - {activity.activity}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  placesTitle: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    color: Colors.DARK_GRAY,
    marginBottom: 10,
  },
  placeCard: {
    marginBottom: 15,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    overflow: "hidden",
    width: 250,
    marginRight: 10,
  },
  placeImage: {
    width: "100%",
    height: 150,
  },
  placeDetails: {
    padding: 10,
  },
  placeName: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    marginBottom: 5,
  },
  placeDescription: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 10,
  },
  placeInfo: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
    marginVertical: 2,
  },
  planTitle: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    color: Colors.DARK_GRAY,
    marginVertical: 20,
  },
  dayContainer: {
    marginBottom: 15,
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 10,
    borderRadius: 10,
  },
  dayTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    marginBottom: 5,
  },
  activityText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
    marginLeft: 10,
  },
});

export default PlacesToVisit;
