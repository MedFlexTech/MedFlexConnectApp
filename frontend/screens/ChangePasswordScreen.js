import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ChangePasswordScreen = ({ route, navigation }) => {
    const { navigate } = useNavigation();

    const { uid } = route.params;
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = () => {
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
          // An error happened or reauthentication may be needed
          if (error.code === 'auth/requires-recent-login') {
            Alert.alert('Reauthentication Required', 'Please log out and log in again to update your password.');
          } else {
            Alert.alert('Update Failed', error.message);
          }
        });
      };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter New Password"
        value={newPassword}
        onChangeText={setNewPassword}
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
