import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Discover() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.squareButton, { backgroundColor: '#FF5252' }]}>
        <MaterialIcons name="wb-sunny" size={40} color="white" />
        <Text style={styles.label}>Weather</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.squareButton, { backgroundColor: '#4CAF50' }]}
        onPress={() => router.push('/Pages/HomeScreen')} // Use the correct path
      >
        <MaterialIcons name="android" size={40} color="white" />
        <Text style={styles.label}>Chat-bot</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.squareButton, { backgroundColor: '#2196F3' }]}>
        <MaterialIcons name="map" size={40} color="white" />
        <Text style={styles.label}>Map</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 33,
    backgroundColor: '#e0f7fa', // Light background
  },
  squareButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
