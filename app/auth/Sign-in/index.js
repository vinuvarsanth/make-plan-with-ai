import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../../configs/FirebaseConfig';

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();
  
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);
  
  const onSignIn=()=>{
    if(!email && !password)
    {
      ToastAndroid.show("Please Fill all the Details.",ToastAndroid.LONG)
    }
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    router.replace('/mytrip')
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode);
  });

  }

  return (
    <View style={{
      padding: 25,
      paddingTop: 50,
      backgroundColor: Colors.WHITE,
      height: '100%',
      justifyContent: 'space-between',
    }}>
      {/* Main Content */}
      <View>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="back" size={24} color="black" style={{ marginBottom: 25 }} />
        </TouchableOpacity>

        {/* Modified Texts */}
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 30,
          marginBottom: 10
        }}>Let's Sign You In</Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 24,
          color: Colors.GRAY,
          marginBottom: 5
        }}>Welcome Back</Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 24,
          color: Colors.GRAY,
          marginBottom: 20
        }}>You've been missed!</Text>

        {/* Email */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'outfit' }}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value)=>setEmail(value)}
            placeholder='Enter Email'
            keyboardType='email-address'
            autoCapitalize='none'
          />
        </View>

        {/* Password */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'outfit' }}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            placeholder='Enter Password'
            onChangeText={(value)=>setPassword(value)}
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 15,
            marginTop: 50,
            alignItems: 'center' // Center the text
          }}
          onPress={(onSignIn)} // Replace with your sign-in logic
        >
          <Text style={{
            color: Colors.WHITE,
            fontFamily: 'outfit',
            fontSize: 18,
          }}>
            Sign In
          </Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity
          onPress={() => router.replace('/auth/Sign-up')}
          style={{ padding: 10, marginTop: 20 }}
        >
          <Text style={{
            color: Colors.BLUE,
            textAlign: 'center',
            textDecorationLine: 'underline'
          }}>
            Click here to Create a New Account...
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer Message */}
      <Text style={{
        textAlign: 'center',
        color: Colors.GRAY,
        fontFamily: 'outfit',
        fontSize: 14,
        marginBottom: 20
      }}>
        © 2024 Your Company Name. All rights reserved.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    fontFamily: 'outfit'
  },
});
