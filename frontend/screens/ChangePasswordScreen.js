import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ChangePasswordScreen = ({ route }) => {
  const navigation = useNavigation();
  const { uid } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    const user = auth().currentUser;
    
    user.updatePassword(newPassword).then(() => {
      // Update successful, update passwordFlag in Firestore
      firestore().collection('users').doc(uid).update({ passwordFlag: 1 })
        .then(() => {
          Alert.alert('Password Updated', 'Your password has been updated successfully.');
          navigation.goBack(); // Navigate back or to another part of your app
        })
        .catch(error => {
          Alert.alert('Firestore Update Failed', error.message);
        });
    }).catch(error => {
      // Handle errors like password complexity or reauthentication needed
      let errorMessage = 'Failed to update password. Please try again.';
      if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Choose a stronger password.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Reauthentication required. Please log out and log in again to update your password.';
      }
      Alert.alert('Update Failed', errorMessage);
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Change Password" onPress={handleChangePassword} />
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

export default ChangePasswordScreen;
