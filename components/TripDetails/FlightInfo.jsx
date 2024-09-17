import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Colors } from "../../constants/Colors";

const FlightInfo = ({ flightData }) => {
  if (!flightData) return <Text>No Flight Info Available</Text>;

  const handleBooking = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.flightTitle}>✈️ Flight Details</Text>
      <View style={styles.flightDetails}>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Airline: </Text>
          <Text style={styles.flightText}>{flightData.departure.airline}</Text>
        </Text>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Departure Airport: </Text>
          <Text style={styles.flightText}>{flightData.departure.airport}</Text>
        </Text>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Departure Date: </Text>
          <Text style={styles.flightText}>{flightData.departure.departure_date}</Text>
        </Text>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Departure Time: </Text>
          <Text style={styles.flightText}>{flightData.departure.departure_time}</Text>
        </Text>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Arrival Airport: </Text>
          <Text style={styles.flightText}>{flightData.arrival.airport}</Text>
        </Text>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Arrival Date: </Text>
          <Text style={styles.flightText}>{flightData.arrival.arrival_date}</Text>
        </Text>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Arrival Time: </Text>
          <Text style={styles.flightText}>{flightData.arrival.arrival_time}</Text>
        </Text>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Flight No: </Text>
          <Text style={styles.flightText}>{flightData.departure.flight_number}</Text>
        </Text>
        <Text style={styles.flightRow}>
          <Text style={styles.boldText}>Price: </Text>
          <Text style={styles.flightText}>{flightData.departure.price}</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => handleBooking(flightData.departure.booking_url)}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: Colors.GR,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  flightTitle: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    color: Colors.DARK_GRAY,
    marginBottom: 10,
  },
  flightDetails: {
    marginBottom: 15,
  },
  flightRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  boldText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.BLACK,
  },
  flightText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
  bookButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  bookButtonText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
});

export default FlightInfo;
