import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // Check for empty fields
    if (!email || !password || !fullName) {
      ToastAndroid.show('Please fill all the details to create an account', ToastAndroid.LONG);
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user);
    router.replace('/mytrip')
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode);
    // ..
  });
  }

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 50,
        backgroundColor: Colors.WHITE,
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      <View>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="back" size={24} color="black" style={{ marginBottom: 25 }} />
        </TouchableOpacity>

        {/* Title */}
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 30,
            marginBottom: 20,
          }}
        >
          Create New Account
        </Text>

        {/* User Full Name */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontFamily: 'outfit' }}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            onChangeText={(value) => setFullName(value)}
          />
        </View>

        {/* Email */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'outfit' }}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setEmail(value)}
            placeholder="Enter Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'outfit' }}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            onChangeText={(value) => setPassword(value)}
            placeholder="Enter Password"
          />
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 15,
            marginTop: 50,
            alignItems: 'center',
          }}
          onPress={OnCreateAccount}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: 'outfit',
              fontSize: 18,
            }}
          >
            Create Account
          </Text>
        </TouchableOpacity>

        {/* Already have an Account Button */}
        <TouchableOpacity
          onPress={() => router.replace('/auth/Sign-in')}
          style={{ padding: 10, marginTop: 20 }}
        >
          <Text
            style={{
              color: Colors.BLUE,
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}
          >
            Already have an Account? Sign here.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer Message */}
      <Text
        style={{
          textAlign: 'center',
          color: Colors.GRAY,
          fontFamily: 'outfit',
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        © 2024 Your Company Name. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    fontFamily: 'outfit',
  },
});
