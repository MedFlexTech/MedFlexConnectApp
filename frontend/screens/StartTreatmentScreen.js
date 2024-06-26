import React, { useState, useEffect } from 'react';
import { Button, Text, StyleSheet, SafeAreaView, View, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { TimerProvider } from '../services/TimerContext.js';

function StartTreatmentScreen(props) {
    /*Display and format date for the title*/
    const getCurrentDate = () =>{
        const theMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let date = new Date();
        let month = theMonths[date.getMonth()];
        let day = date.getDate();
        let year = date.getFullYear();
        return month + " " + day + ", " + year;
    }


    const [treatmentData, setTreatmentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalMinutes, setTotalMinutes] = useState(null);
    const [docId, setDocId] = useState(null);
    useEffect(() => {
        const getTime = async () => {
            console.log("###")
            
            var today = new Date();
            today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 to represent the beginning of the day

            // Construct a Timestamp object for today's date
            var startOfTodayTimestamp = firebase.firestore.Timestamp.fromDate(today);

            // Construct a Timestamp object for the end of today (just before midnight)
            var endOfTodayTimestamp = firebase.firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
            // actually returning the treatment
            const userDocument = await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('treatments').where("date", ">=", startOfTodayTimestamp).where("date", "<=", endOfTodayTimestamp).limit(1).get();
            
            console.log(userDocument.empty + " <- user is empty");
            if (userDocument.empty) {
                setTreatmentData(null); // Explicitly set to null for 'no treatments' case
            } else{
                const doc = userDocument.docs[0];
                console.log(doc.id);
                setDocId(doc.id); // Store the ID of the documen
                const data = userDocument.docs[0].data();
                console.log(docId);
                if(data.inProgress == true){
                    return;
                }
                else{
                    console.log('here');
                    console.log(data);
                    setTreatmentData(data);
                    let time = Number(data.boneMinutes) + Number(data.muscleMinutes);
                    setTotalMinutes(time)
                    console.log(treatmentData);
                }
            }
            setIsLoading(false); // Data fetching complete
        }
        getTime()
    }, []);

    // useEffect(() => {
    //     let isMounted = true; // Flag to check if component is still mounted
    //     const getTime = async () => {
    //       try {
    //         var today = new Date();
    //         today.setHours(0, 0, 0, 0);
      
    //         var startOfTodayTimestamp = firebase.firestore.Timestamp.fromDate(today);
    //         var endOfTodayTimestamp = new Date(today);
    //         endOfTodayTimestamp.setHours(23, 59, 59, 999);
      
    //         const userDocument = await firestore()
    //           .collection('users')
    //           .doc(firebase.auth().currentUser.uid)
    //           .collection('treatments')
    //           .where("date", ">=", startOfTodayTimestamp)
    //           .where("date", "<=", endOfTodayTimestamp)
    //           .limit(1)
    //           .get();
      
    //         if (!userDocument.empty && isMounted) {
    //           const doc = userDocument.docs[0];
    //           const data = doc.data();
    //           if (!data.inProgress) {
    //             setDocId(doc.id);
    //             setTreatmentData(data);
    //             setTotalMinutes(data.boneMinutes + data.muscleMinutes);
    //           }
    //         }
    //       } catch (error) {
    //         console.error("Failed to fetch treatment data: ", error);
    //         Alert.alert('Error', 'Failed to fetch treatment data.');
    //       } finally {
    //         if (isMounted) {
    //           setIsLoading(false);
    //         }
    //       }
    //     };
    //     getTime();
      
    //     return () => {
    //       isMounted = false; // Set flag to false when component unmounts
    //     }
    //   }, []);      
    
    //Timer states
    const [isPlaying, setIsPlaying] = useState(false);
    const changeIsPlaying = () => {
        setIsPlaying(prev => !prev)
    };
    const [buttonState, setButtonState] = useState('Start');
    const [buttonStyle, setButtonStyle] = useState(styles.startButton);
    //handles changing state for the start/pause/resume button
    const updateProgress = async () =>{
        try{
            await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('treatments').doc(docId).update({inProgress: true});
        }
        catch (e){
            console.log(e);
        }
    }
    const handlePress = () =>{
        switch(buttonState){
            case 'Start':
                setButtonState('Pause');
                setButtonStyle(styles.pauseButton);
                break;
            case 'Pause':
                setButtonState('Resume');
                setButtonStyle(styles.startButton);
                break;
            case 'Resume':
                setButtonState('Pause');
                setButtonStyle(styles.pauseButton);
                break;
            default:
                break;
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>Today's Treatment</Text>
                    <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
            {isLoading ? (
                <View>
                    <Text>Fetching Treatment Details...</Text>
                </View>
            ) : treatmentData ? (
                <View style={styles.centeredContainer}>
                    <View style={styles.timer}>
                        {/*Timer here*/}
                        <CountdownCircleTimer
                        isPlaying = {isPlaying}
                        duration={totalMinutes * 60}
                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[7, 5, 2, 0]}
                        updateInterval={1}
                        >
                            {({ remainingTime, color }) => (
                                <Text style={styles.timeText}>
                                    {String(Math.floor(remainingTime/60)).padStart(2, '0')}:{String(remainingTime % 60).padStart(2, '0')}
                                </Text>
                            )}
                        </CountdownCircleTimer>
                    </View>
                    <View> 
                        {/*Display treatment info here*/}
                        <Text style={styles.treatmentText}>{`${treatmentData.boneMinutes} Minutes Bone Growth Stimulation`}</Text>
                        <Text style={styles.treatmentText}>{`${treatmentData.muscleMinutes} Minutes Muscle Stimulation`}</Text>
                    </View>
                    <View style={styles.centeredContainer}>
                        <Pressable style={[buttonStyle]} onPress={() => {changeIsPlaying(); handlePress()}}>
                            <Text style={styles.text}>{buttonState}</Text>
                        </Pressable>
                    </View>
                </View>
            ): (
                <View style={styles.centeredContainer}>
                    <Text style={styles.noTreatmentText}>No Treatments Today</Text>
                    <Pressable style={styles.disabledButton}> 
                        <Text style={styles.text}>Start</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

export default function WrappedStartTreatmentScreen(props){
    return(
        <TimerProvider>
            <StartTreatmentScreen {...props} />
        </TimerProvider>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#fff",
    },
    timer:{
        paddingBottom: 25,
    },
    startButton:{
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 14,
        backgroundColor: '#5A7CF6',
        boxShadow: '0px 4px 17.5px 0px',
        width: 174,
        height: 46,
    },
    treatmentText:{
        marginBottom: 10,
        fontSize: 16,
    },
    noTreatmentText:{
        marginTop: 50,
        marginBottom: 150,
        fontSize: 18,
    },
    timeText:{
        color: '#004777',
        fontSize: 30
    },
    disabledButton: {
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 14,
        backgroundColor: '#5A7CF6',
        boxShadow: '0px 4px 17.5px 0px',
        width: 174,
        height: 46,
        opacity: 0.5 
    },
    pauseButton:{
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 14,
        backgroundColor: '#999',
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
        paddingTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }

});
