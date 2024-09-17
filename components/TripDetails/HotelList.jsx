import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

const HotelList = ({ hotelList }) => {
  if (!hotelList) return <Text>No Hotels Available</Text>;

  return (
    <View style={styles.hotelContainer}>
      <Text style={styles.hotelTitle}>
          🏢Hotels
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hotelList.map((hotel, index) => (
          <View key={index} style={styles.hotelCard}>
            <Image source={{ uri: hotel.image_url }} style={styles.hotelImage} />
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
    marginBottom:10
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
