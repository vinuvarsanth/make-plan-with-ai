import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);
  const [place, setPlace] = useState(''); // State for the place to search
  const [nearbyPlaces, setNearbyPlaces] = useState([]); // State to store nearby places
  const mapRef = useRef(null);

  const API_KEY = '910d800f9729cf2d473e94b755e956d7'; // Your OpenWeatherMap API key
  const PLACES_API_KEY = 'AIzaSyApf746j5KUhwUCcVbKRUIWCRkZrEVciUs'; // Your Google Places API key

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      fetchWeather(location.coords.latitude, location.coords.longitude);
      fetchNearbyPlaces(location.coords.latitude, location.coords.longitude); // Fetch nearby places

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

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      Alert.alert('Error', 'Unable to fetch weather data.');
    }
  };

  // Fetch nearby places using the Google Places API
  const fetchNearbyPlaces = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant|park|tourist_attraction&key=${PLACES_API_KEY}`
      );
      setNearbyPlaces(response.data.results);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      Alert.alert('Error', 'Unable to fetch nearby places.');
    }
  };

  const searchPlace = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&fields=geometry&key=${PLACES_API_KEY}`
      );

      if (response.data.candidates.length > 0) {
        const { lat, lng } = response.data.candidates[0].geometry.location;

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }

        setLocation({ latitude: lat, longitude: lng });
        fetchWeather(lat, lng);
        fetchNearbyPlaces(lat, lng); // Fetch nearby places for searched location
      } else {
        Alert.alert('Error', 'Place not found.');
      }
    } catch (error) {
      console.error('Error searching place:', error);
      Alert.alert('Error', 'Unable to search for the place.');
    }
  };

  let latitude = location?.latitude || 37.78825;
  let longitude = location?.longitude || -122.4324;

  return (
    <View style={styles.container}>
      {/* Input to search for a place */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a place"
          value={place}
          onChangeText={(text) => setPlace(text)} // Handle user input
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchPlace}>
          <MaterialIcons name="search" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Map displaying user's or searched location */}
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
          {/* Marker for current or searched location */}
          <Marker
            coordinate={{ latitude: latitude, longitude: longitude }}
            title="Location"
            pinColor="blue" // Optional: change color for the marker
          />
          {/* Display nearby places as markers */}
          {nearbyPlaces.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>
          {errorMsg ? errorMsg : 'Fetching location...'}
        </Text>
      )}

      {/* Weather Information */}
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>Weather: {weather.weather[0].description}</Text>
          <Text style={styles.weatherText}>Temperature: {weather.main.temp} °C</Text>
          <Text style={styles.weatherText}>Humidity: {weather.main.humidity} %</Text>
        </View>
      )}

      {/* List of nearby places */}
      {nearbyPlaces.length > 0 && (
        <ScrollView style={styles.nearbyContainer}>
          <Text style={styles.nearbyHeading}>Nearby Places:</Text>
          {nearbyPlaces.map((place, index) => (
            <View key={index} style={styles.nearbyPlace}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeDetails}>{place.vicinity}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Icon to fetch current location */}
      <TouchableOpacity style={styles.iconButton} onPress={getCurrentLocation}>
        <MaterialIcons name="my-location" size={40} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

// Styles for the component
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
  weatherContainer: {
    position: 'absolute',
    bottom: 22, // Adjusted to be above the nearby places container
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  weatherText: {
    fontSize: 16,
  },
  iconButton: {
    position: 'absolute',
    bottom: 45,
    right: 35,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 5,
    elevation: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    zIndex: 1,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  nearbyContainer: {
    position: 'absolute',
    bottom: 125, // Lowered to give space for the weather container
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    maxHeight: 130, // Reduced height to make more room
  },
  nearbyHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nearbyPlace: {
    marginBottom: 10,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeDetails: {
    fontSize: 14,
    color: 'gray',
  },
});
