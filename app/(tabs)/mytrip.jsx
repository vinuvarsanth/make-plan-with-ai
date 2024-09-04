import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import { auth, db } from './../../configs/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import UserTripList from '../../components/MyTrips/UserTripList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Mytrip() {
  const [userTrips, setUserTrips] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetMyTrips();
    }
  }, [user]);

  const GetMyTrips = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'UserTrips'), where('userEmail', '==', user.email));
      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push(doc.data());
      });
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching user trips: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrip = () => {
    console.log('Add trip icon clicked, navigating...');
    router.push('/create-trip/search-place');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Trip</Text>
          {/* Add Pressable to make the icon clickable */}
          <Pressable onPress={handleAddTrip}>
            <MaterialIcons name="add-circle-outline" size={35} color="black" />
          </Pressable>
        </View>

        {loading && <ActivityIndicator size="large" color={Colors.PRIMARY} />}

        {userTrips.length === 0 ? (
          <StartNewTripCard />
        ) : (
          <UserTripList userTrips={userTrips} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop: 55, // Adjust based on header height
  },
  scrollViewContent: {
    paddingHorizontal: 25,
    paddingBottom: 70, // Adjust based on the height of your tabs
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
  },
});
