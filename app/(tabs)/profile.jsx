import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../configs/FirebaseConfig';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setUpdatedUserData(docSnap.data()); // initialize with existing data
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

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, updatedUserData);
      setUserData(updatedUserData);  // Update the local state with the new data
      setEditMode(false); // Exit edit mode
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Profile</Text>

        {userData ? (
          <>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Full Name:</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={updatedUserData.fullName}
                  onChangeText={(value) => setUpdatedUserData({ ...updatedUserData, fullName: value })}
                />
              ) : (
                <Text style={styles.profileDetail}>{userData.fullName}</Text>
              )}
              <TouchableOpacity onPress={handleEditToggle}>
                <AntDesign name="edit" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Email:</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={updatedUserData.email}
                  onChangeText={(value) => setUpdatedUserData({ ...updatedUserData, email: value })}
                />
              ) : (
                <Text style={styles.profileDetail}>{userData.email}</Text>
              )}
              <TouchableOpacity onPress={handleEditToggle}>
                <AntDesign name="edit" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            {/* This is where the phone number field is different (no space between label and value) */}
            <View style={[styles.profileRow, styles.phoneNumberRow]}>
              <Text style={styles.profileLabel}>Phone Number:</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={updatedUserData.phoneNumber}
                  onChangeText={(value) => setUpdatedUserData({ ...updatedUserData, phoneNumber: value })}
                />
              ) : (
                <Text style={styles.profileDetail}>{userData.phoneNumber}</Text>
              )}
              <TouchableOpacity onPress={handleEditToggle}>
                <AntDesign name="edit" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Address:</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={updatedUserData.address}
                  onChangeText={(value) => setUpdatedUserData({ ...updatedUserData, address: value })}
                />
              ) : (
                <Text style={styles.profileDetail}>{userData.address}</Text>
              )}
              <TouchableOpacity onPress={handleEditToggle}>
                <AntDesign name="edit" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            {/* Save Button (only visible in edit mode) */}
            {editMode && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.profileDetail}>No user data available</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Adds space between label and value
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 10,
  },
  phoneNumberRow: {
    justifyContent: 'flex-start', // No space between label and value for phone number
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    width: '40%',
  },
  profileDetail: {
    fontSize: 16,
    color: '#333',
    width: '50%',
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    width: '50%',
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
