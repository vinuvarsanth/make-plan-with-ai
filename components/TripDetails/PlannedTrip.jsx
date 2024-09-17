import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

const PlacesToVisit = ({ details, dailyPlan }) => {
  if (!details || details.length === 0) return <Text>No Places Available</Text>;

  return (
    <View style={styles.container}>
      {/* Places to Visit Section */}
      <Text style={styles.placesTitle}>📌 Places to Visit</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {details.map((place, index) => (
          <View key={index} style={styles.placeCard}>
            <Image source={{ uri: place.image_url }} style={styles.placeImage} />
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
    backgroundColor: Colors.GR,
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
