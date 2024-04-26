import React, {useState, useEffect} from 'react';
import { SafeAreaView, Image, Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth, { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';


function ProfileScreen(props) {
    const {navigate} = useNavigation();
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        address: '',
      });

      useEffect(() => {
        async function fetchUserProfile() {
          // Fetch the user profile using the userId from your Firebase DB
          const profile = await firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
          
          setUserProfile({
            name: profile.data().firstName + " " +profile.data().lastName,
            email: profile.data().email,
            mobileNumber: profile.data().phoneNumber,
            address: profile.data().address,
          });
        }
    
        fetchUserProfile();
      }, []);

    return (
        <ScrollView style={styles.container}>
      <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>Your Profile</Text>
            </View>
      <View style={styles.profileDetails}>
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.email}>{userProfile.email}</Text>
        <Text style={styles.mobileNumber}>{userProfile.mobileNumber}</Text>
        <Text style={styles.address}>{userProfile.address}</Text>
      </View>
      <Pressable style={styles.button} onPress={() => {/* logic to export data */}}>
        <Text style={styles.buttonText}>Export Data</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => {navigate('ChangePassword', { uid: firebase.auth().currentUser.uid })}}>
        <Text style={styles.buttonText}>Change Password</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => auth().signOut()}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    squiggle:{
        position: 'absolute',
        aspectRatio: 4,
        resizeMode: 'stretch',
        width: '100%',
        alignContent: 'center'
    },
    heading:{
        marginBottom: 90,
    },
    greeting:{
        marginTop: '14%',
        marginLeft: '6%',
        textAlign: 'left', 
        color: 'white',
        fontSize: 32,
    },
    profileDetails: {
      margin: 20,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    email: {
      fontSize: 16,
      marginBottom: 10,
    },
    mobileNumber: {
      fontSize: 16,
      marginBottom: 10,
    },
    address: {
      fontSize: 16,
      marginBottom: 10,
    },
    button: {
      marginHorizontal: 20,
      marginTop: 10,
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      alignItems: 'flex-start',
      elevation: 3, // For Android shadow
      shadowOpacity: 0.1, // For iOS shadow
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#5C80FC',
      fontFamily: 'Roboto', 
    },
  });

export default ProfileScreen;