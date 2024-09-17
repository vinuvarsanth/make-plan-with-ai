import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { db } from '../../configs/FirebaseConfig'; // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';

export default function Discover() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const mapRef = useRef(null);

  // Fetch current location and destinations when component mounts
  useEffect(() => {
    getCurrentLocation();
    fetchDestinations();
  }, []);

  // Function to fetch the current location
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      // Recenter map to the new location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch location.');
    }
  };

  // Function to fetch popular destinations from Firestore
  const fetchDestinations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'destinations'));
      const destinations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPopularDestinations(destinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      Alert.alert('Error', 'Unable to fetch destinations.');
    }
  };

  // Function to continuously track the user's location
  const trackLocation = async () => {
    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Minimum distance change (in meters) to trigger an update
        },
        (location) => {
          setLocation(location.coords);

          // Recenter map to the new location
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to track location.');
    }
  };

  let latitude = location?.latitude || 37.78825; // Default latitude
  let longitude = location?.longitude || -122.4324; // Default longitude

  return (
    <View style={styles.container}>

      {/* Map displaying user's location and popular destinations */}
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Marker for current location */}
          <Marker
            coordinate={{ latitude: latitude, longitude: longitude }}
            title="You are here"
          />

          {/* Markers for popular destinations */}
          {popularDestinations.map((destination) => (
            <Marker
              key={destination.id}
              coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
              title={destination.name}
              pinColor="blue" // Optional: change color for destination markers
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>
          {errorMsg ? errorMsg : 'Fetching location...'}
        </Text>
      )}

      {/* "Track Location" button to start continuous tracking */}
      <TouchableOpacity style={styles.trackLocationButton} onPress={trackLocation}>
        <Text style={styles.trackLocationButtonText}>Track Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  trackLocationButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
  trackLocationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
