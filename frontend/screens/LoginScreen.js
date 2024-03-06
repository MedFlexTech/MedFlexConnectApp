import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth'; // Import the auth module

const LoginScreen = () => {
  const [email, setEmail] = useState(''); // Updated to 'email' for clarity
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Use Firebase authentication to sign in with email and password
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // Login successful
        Alert.alert('Logged in!', 'You are logged in successfully.');
      })
      .catch(error => {
        // Handle errors here
        const { code, message } = error;
        Alert.alert('Login failed!', message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none" // Ensures email is entered in lower case
        keyboardType="email-address" // Provides a suitable keyboard for email input
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
