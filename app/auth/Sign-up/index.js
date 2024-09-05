import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './../../../configs/FirebaseConfig'; // Adjust path as necessary
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const OnCreateAccount = async () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show('Please fill all the details to create an account', ToastAndroid.LONG);
      return;
    }
4
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        // Add more fields if needed
      });

      router.replace('/mytrip');
    } catch (error) {
      console.error("Error signing up: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="back" size={24} color="black" style={styles.backButton} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Create New Account</Text>

        {/* User Full Name */}
        <View style={styles.inputContainer}>
          <Text>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            onChangeText={(value) => setFullName(value)}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setEmail(value)}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            onChangeText={(value) => setPassword(value)}
            placeholder="Enter Password"
          />
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={OnCreateAccount}
        >
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Already have an Account Button */}
        <TouchableOpacity
          onPress={() => router.replace('/auth/Sign-in')}
          style={styles.signInButton}
        >
          <Text style={styles.signInButtonText}>Already have an Account? Sign here.</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Message */}
      <Text style={styles.footerText}>© 2024 Your Company Name. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 50,
    backgroundColor: Colors.WHITE,
    height: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    marginBottom: 25,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    fontFamily: 'outfit',
  },
  createButton: {
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    marginTop: 50,
    alignItems: 'center',
  },
  createButtonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit',
    fontSize: 18,
  },
  signInButton: {
    padding: 10,
    marginTop: 20,
  },
  signInButtonText: {
    color: Colors.BLUE,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footerText: {
    textAlign: 'center',
    color: Colors.GRAY,
    fontFamily: 'outfit',
    fontSize: 14,
    marginBottom: 20,
  },
});
