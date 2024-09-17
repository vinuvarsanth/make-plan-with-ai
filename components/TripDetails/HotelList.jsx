import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Colors } from "../../constants/Colors";

// Function to search for place id from Google Places API by hotel name
const searchPlaceId = async (hotelName) => {
  try {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(hotelName)}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
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

const HotelList = ({ hotelList }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photoPromises = hotelList.map(async (hotel) => {
          const placeId = await searchPlaceId(hotel.name);
          if (placeId) {
            return await getPhotoRef(placeId);
          }
          return null;
        });

        const photoReferences = await Promise.all(photoPromises);
        const photoUrls = photoReferences.map(ref => ref ? getPhotoUrl(ref) : null).filter(url => url);
        setPhotos(photoUrls);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, [hotelList]);

  const getPhotoUrl = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`;
  };

  if (!hotelList || hotelList.length === 0) return <Text>No Hotels Available</Text>;

  return (
    <View style={styles.hotelContainer}>
      <Text style={styles.hotelTitle}>🏢 Hotels</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hotelList.map((hotel, index) => (
          <View key={index} style={styles.hotelCard}>
            <Image source={{ uri: photos[index] }} style={styles.hotelImage} />
            <View style={styles.hotelDetails}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelPrice}>Price: {hotel.price}</Text>
              <Text style={styles.hotelRating}>Rating: {hotel.rating}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  hotelContainer: {
    marginVertical: 20,
  },
  hotelTitle: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    color: Colors.DARK_GRAY,
    marginBottom: 10,
  },
  hotelCard: {
    width: 250,
    marginRight: 15,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 15,
    overflow: "hidden",
  },
  hotelImage: {
    width: "100%",
    height: 150,
  },
  hotelDetails: {
    padding: 10,
  },
  hotelName: {
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
  hotelPrice: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
  },
  hotelRating: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
  },
});

export default HotelList;
