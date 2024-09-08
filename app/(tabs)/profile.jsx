import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db, storage } from "../../configs/FirebaseConfig";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    profileImageUrl: ""
  });

  const [editMode, setEditMode] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
    address: false,
  });

  // Image Picker Function
  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);

      // Upload image to Firebase Storage
      const imageUrl = await uploadImageToFirebase(imageUri);
      setUpdatedUserData((prevData) => ({
        ...prevData,
        profileImageUrl: imageUrl,
      }));
    }
  };

  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (uri) => {
    if (!uri) return null;
    const user = auth.currentUser;
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `profileImages/${user.uid}`);
    const snapshot = await uploadBytes(storageRef, blob);
    
    // Get the download URL for the image
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setUpdatedUserData(docSnap.data());
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
        router.replace("/auth/Sign-in");
      })
      .catch((error) => {
        console.error("Logout Error: ", error);
      });
  };

  const handleEditToggle = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, updatedUserData);
      setUserData(updatedUserData);
      setEditMode({
        fullName: false,
        email: false,
        phoneNumber: false,
        address: false,
      });
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
        <TouchableOpacity style={styles.imageContainer} onPress={onImagePick}>
          {!image && !userData.profileImageUrl ? (
            <Image
              source={require("../../assets/images/profile.jpg")}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={{ uri: image || userData.profileImageUrl }}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.text}>{userData.email || "Not provided"}</Text>
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          {editMode.fullName ? (
            <TextInput
              style={styles.input}
              value={updatedUserData.fullName}
              onChangeText={(text) =>
                setUpdatedUserData({ ...updatedUserData, fullName: text })
              }
            />
          ) : (
            <Text style={styles.text}>
              {userData.fullName || "Not provided"}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => handleEditToggle("fullName")}
            style={styles.editIcon}
          >
            <AntDesign name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          {editMode.phoneNumber ? (
            <TextInput
              style={styles.input}
              value={updatedUserData.phoneNumber}
              onChangeText={(text) =>
                setUpdatedUserData({ ...updatedUserData, phoneNumber: text })
              }
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.text}>
              {userData.phoneNumber || "Not provided"}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => handleEditToggle("phoneNumber")}
            style={styles.editIcon}
          >
            <AntDesign name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          {editMode.address ? (
            <TextInput
              style={styles.input}
              value={updatedUserData.address}
              onChangeText={(text) =>
                setUpdatedUserData({ ...updatedUserData, address: text })
              }
            />
          ) : (
            <Text style={styles.text}>
              {userData.address || "Not provided"}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => handleEditToggle("address")}
            style={styles.editIcon}
          >
            <AntDesign name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    padding: 21,
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 140,
    height: 180,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    width: 120,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  editIcon: {
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
