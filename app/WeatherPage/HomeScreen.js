import { View, Text, SafeAreaView, TextInput, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const apiKey = '910d800f9729cf2d473e94b755e956d7'; // Replace with your weather API key

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      setWeatherData(data);

      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData.list.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchWeather(searchQuery);
    }
  }, [searchQuery]);

  // Mapping weather conditions to image icons
  const getWeatherImage = (condition) => {
    if (condition.includes('rain')) return require('./images/heavyrain.png');
    if (condition.includes('cloud')) return require('./images/cloud.png');
    if (condition.includes('sun')) return require('./images/sun.png');
    return require('./images/partlycloudy.png'); // Default weather image
  };

  return (
    <View style={tw`flex-1 relative`}>
      <StatusBar style="light" />

      {/* Background Image */}
      <Image
        blurRadius={50}
        source={require('./images/bg.png')}
        style={tw`absolute h-full w-full`}
      />

      <SafeAreaView style={tw`flex flex-1`}>
        <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>

          {/* Search Section (moved lower) */}
          <View style={[tw`mx-4 relative z-50 mt-20`, { height: '7%' }]}>
            <View
              style={[tw`flex-row items-center justify-between rounded-full px-4 py-2`, { backgroundColor: theme.bgWhite(0.2) }]}
            >
              <TextInput
                placeholder="Search city"
                placeholderTextColor="lightgray"
                style={tw`flex-1 text-white`}
                onSubmitEditing={(event) => setSearchQuery(event.nativeEvent.text)}  // Trigger fetch on enter
              />
              <Ionicons name="search" size={24} color="white" style={tw`ml-2`} />
            </View>
          </View>

          {/* Conditional Rendering for Weather Data */}
          {!weatherData ? (
            <View style={tw`flex-1 items-center justify-center p-4`}>
              {/* Removed extra image here */}
              <Text style={tw`text-white text-lg mb-2`}>
                Please search for a city to get the weather information.
              </Text>
            </View>
          ) : (
            <>
              {/* Current Weather Display */}
              <View style={tw`flex-1 items-center justify-center p-4`}>
                <Text style={tw`text-white text-3xl font-semibold`}>
                  {weatherData.name}, {weatherData.sys.country}
                </Text>
                <Text style={tw`text-white text-lg capitalize mt-1`}>
                  {weatherData.weather[0].description}
                </Text>

                {/* Weather Icon */}
                <Image
                  source={getWeatherImage(weatherData.weather[0].description)}
                  style={tw`w-40 h-40 mt-4`} // Larger image size
                />

                {/* Current Weather Stats */}
                <View style={tw`flex-row justify-around w-full mt-6`}>
                  <View style={tw`items-center`}>
                    <Text style={tw`text-white text-2xl font-bold`}>
                      {weatherData.main.temp}°C
                    </Text>
                    <Text style={tw`text-white text-sm`}>Temp</Text>
                  </View>
                  <View style={tw`items-center`}>
                    <Text style={tw`text-white text-2xl font-bold`}>
                      {weatherData.wind.speed} m/s
                    </Text>
                    <Text style={tw`text-white text-sm`}>Wind Speed</Text>
                  </View>
                  <View style={tw`items-center`}>
                    <Text style={tw`text-white text-2xl font-bold`}>
                      {weatherData.main.humidity}%
                    </Text>
                    <Text style={tw`text-white text-sm`}>Humidity</Text>
                  </View>
                </View>
              </View>

              {/* 5 Day Forecast */}
              {forecastData && (
                <View style={tw`p-4 mt-8`}>
                  <Text style={tw`text-white text-xl font-semibold`}>Next 5 Days Forecast</Text>
                  <ScrollView horizontal={true} style={tw`mt-4`} showsHorizontalScrollIndicator={false}>
                    {forecastData.map((day, index) => (
                      <View key={index} style={tw`bg-white bg-opacity-20 p-4 rounded-lg mx-2`}>
                        <Text style={tw`text-white font-semibold`}>
                          {new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                        </Text>
                        <Image
                          source={getWeatherImage(day.weather[0].description)}
                          style={tw`w-20 h-20 mt-2`}
                        />
                        <Text style={tw`text-white mt-2`}>
                          {day.main.temp}°C
                        </Text>
                        <Text style={tw`text-white`}>Humidity: {day.main.humidity}%</Text>
                        <Text style={tw`text-white`}>Wind: {day.wind.speed} m/s</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
