import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../../configs/FirebaseConfig';

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  const onSignIn = () => {
    if (!email || !password) {
      ToastAndroid.show("Please Fill all the Details.", ToastAndroid.LONG);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.replace('/mytrip'); // No email passed to the Discover page
        console.log(user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: Colors.WHITE }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="back" size={24} color="black" style={{ marginBottom: 25 }} />
          </TouchableOpacity>

          <Text style={styles.title}>Let's Sign You In</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
          <Text style={styles.subtitle}>You've been missed!</Text>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => setEmail(value)}
              placeholder='Enter Email'
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              placeholder='Enter Password'
              onChangeText={(value) => setPassword(value)}
            />
          </View>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={onSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/auth/Sign-up')}
            style={{ padding: 10, marginTop: 20 }}
          >
            <Text style={styles.createAccountText}>Click here to Create a New Account...</Text>
          </TouchableOpacity>

          <Text style={styles.footerMessage}>
            © 2024 Your Company Name. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 25,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
    marginBottom: 10
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 24,
    color: Colors.GRAY,
    marginBottom: 5
  },
  label: {
    fontFamily: 'outfit',
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    fontFamily: 'outfit'
  },
  signInButton: {
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    marginTop: 50,
    alignItems: 'center',
  },
  signInButtonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit',
    fontSize: 18,
  },
  createAccountText: {
    color: Colors.BLUE,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  footerMessage: {
    textAlign: 'center',
    color: Colors.GRAY,
    fontFamily: 'outfit',
    fontSize: 14,
    marginTop: 20,
  }
});
