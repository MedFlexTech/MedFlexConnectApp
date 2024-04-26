import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Text } from 'react-native';
import auth from '@react-native-firebase/auth'; // Import the auth module
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Validation Failed', 'Please enter both email and password.');
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        // Login successful
        const uid = response.user.uid;
        firestore().collection('users').doc(uid).get().then(documentSnapshot => {
          if(documentSnapshot.exists){
            const userData = documentSnapshot.data();
            if(userData.passwordFlag === 0){
              Alert.alert('Change Password', 'Please change your password.', [
                { text: 'OK', onPress: () => navigate('ChangePassword', { uid: uid }) }
              ]);
            }
            else{
              navigate('HomeScreen');
              Alert.alert('Logged in!', 'You are logged in successfully.');
            }
          } else {
            Alert.alert('No User Data', 'No user data found.');
          }
        })
      })
      .catch(error => {
        let errorMessage = '';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is invalid.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'The user corresponding to the given email has been disabled.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'There is no user corresponding to the given email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'The password is invalid for the given email, or the account corresponding to the email does not have a password set.';
            break;
          default:
            errorMessage = 'An unexpected error occurred. Please try again.';
        }
        Alert.alert('Login failed!', errorMessage);
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/Squiggles.jpg')} style={styles.banner} />
        <Text style={styles.appName}>MedFlex Connect</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} style={styles.button}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  banner: {
    position: 'absolute',
    aspectRatio: 4,
    resizeMode: 'stretch',
    width: '100%',
    alignContent: 'center'
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: '15%',
    color: 'white'
  },
  formContainer: {
    width: '80%',
    margin: '50%'
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
