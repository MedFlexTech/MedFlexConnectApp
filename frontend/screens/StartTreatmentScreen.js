import React, { useState, useEffect } from 'react';
import { Button, Text, StyleSheet, SafeAreaView, View, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';


function StartTreatmentScreen(props) {
    {/*Display and format date for the title*/}
    const getCurrentDate = () =>{
        const theMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let date = new Date();
        let month = theMonths[date.getMonth()];
        let day = date.getDate();
        let year = date.getFullYear();
        return month + " " + day + ", " + year;
    }

    {/*return date for database lookup*/}
    const getDate = () => {
        let date = new Date();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        return month + "-" + day + "-" + year;
    }

    
    const [boneMinutes, setBoneMinutes] = useState(null);
    const [muscleMinutes, setMuscleMinutes] = useState(null);
    useEffect(() => {
        const getTime = async () => {
            const userDocument = await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('treatments').where('date', '==', getDate()).limit(1).get();
            if (!userDocument.empty) {
                const treatmentData = userDocument.docs[0].data();
                const boneMinutes = treatmentData.boneMinutes;
                const muscleMinutes = treatmentData.muscleMinutes;
                setBoneMinutes(boneMinutes);
                setMuscleMinutes(muscleMinutes);
            }
        }
        getTime()
    }, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>Today's Treatment</Text>
                    <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
            <View>
                 {/*Timer here*/}
                
            </View>
            <View> 
                {/*Display treatment info here*/}
                <Text>{boneMinutes !== null ? `${boneMinutes} Minutes Bone Growth Stimulation` : 'Fetching bone growth stimulation time...'}</Text>
                <Text>{muscleMinutes !== null ? `${muscleMinutes} Minutes Muscle Stimulation` : 'Fetching muscle stimulation time...'}</Text>
            </View>
            
            <View style={styles.centeredContainer}>
                <Pressable style={styles.button}>
                    <Text style={styles.text}>Start</Text>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#fff",
    },

    button:{
        justifyContent: 'center',
        alignContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 14,
        backgroundColor: '#5A7CF6',
        boxShadow: '0px 4px 17.5px 0px',
        width: 174,
        height: 46,
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
    date:{
        marginLeft: '7%',
        textAlign: 'left', 
        color: 'white',
        fontSize: 12,
    },
    statusBox:{
        marginLeft: '10%',
        backgroundColor: '#5A7CF6',
        width: '80%',
        height:'15%',
        borderRadius: 4,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
    },
    text:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Roboto',
        fontSize: 20
    },
    centeredContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    }

});

export default StartTreatmentScreen;