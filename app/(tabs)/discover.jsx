import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Discover() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF5252" }]}
          onPress={() => router.push("/WeatherPage/HomeScreen")}
        >
          <MaterialIcons name="wb-sunny" size={40} color="white" />
          <Text style={styles.buttonText}>Weather</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() => router.push("/ChatPages/HomeScreen")} // Use the correct path
        >
          <MaterialIcons name="android" size={40} color="white" />
          <Text style={styles.buttonText}>Chat-bot</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2196F3" }]}
          onPress={() => router.push("MapPage/MapScreen")}
        >
          <MaterialIcons name="map" size={40} color="white" />
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#9C27B0" }]}
          onPress={() => router.push("/TODOPage/HomeScreen")}
        >
          <MaterialIcons name="checklist" size={40} color="white" />
          <Text style={styles.buttonText}>To-Do</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Light gray background
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  button: {
    width: "40%",
    height: 120,
    borderRadius: 20, // Smoother corners
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18, // Slightly larger text
    color: "white",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
