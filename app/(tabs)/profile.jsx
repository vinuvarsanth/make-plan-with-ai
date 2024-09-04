import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../configs/FirebaseConfig';
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is authenticated.");
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.replace('/auth/Sign-in');
      })
      .catch((error) => {
        console.error("Logout Error: ", error);
      });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Text style={styles.subtitle}>Welcome to your profile!</Text>

      {userData ? (
        <>
          <Text style={styles.profileDetail}>Email: {userData.email}</Text>
          <Text style={styles.profileDetail}>Full Name: {userData.fullName}</Text>
        </>
      ) : (
        <Text style={styles.profileDetail}>No user data available</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  profileDetail: {
    fontSize: 16,
    marginVertical: 5,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
