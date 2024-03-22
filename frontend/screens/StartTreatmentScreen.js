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

    /*return date for database lookup*/
    const getDate = () => {
        let date = new Date();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        return month + "-" + day + "-" + year;
    }

    const [treatmentData, setTreatmentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalMinutes, setTotalMinutes] = useState(null);
    useEffect(() => {
        const getTime = async () => {
            const userDocument = await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('treatments').where('date', '==', getDate()).limit(1).get();
            
            if (userDocument.empty) {
                setTreatmentData(null); // Explicitly set to null for 'no treatments' case
            } else {
                const data = userDocument.docs[0].data();
                setTreatmentData(data);
            }
            setIsLoading(false); // Data fetching complete
        }
        getTime()
    }, []);
    
    //Timer states
    const [isPlaying, setIsPlaying] = useState(false);
    const changeIsPlaying = () => {
        setIsPlaying(prev => !prev)
    };
    const [buttonState, setButtonState] = useState('Start');
    const [buttonStyle, setButtonStyle] = useState(styles.startButton);
    //handles changing state for the start/pause/resume button
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
                    <View>
                        {/*Timer here*/}
                        <CountdownCircleTimer
                        isPlaying = {isPlaying}
                        duration={totalMinutes * 60}
                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[7, 5, 2, 0]}
                        updateInterval={1}
                        >
                            {({ remainingTime, color }) => (
                                <Text>
                                    {Math.floor(remainingTime/60)}:{remainingTime % 60}
                                </Text>
                            )}
                        </CountdownCircleTimer>
                    </View>
                    <View> 
                        {/*Display treatment info here*/}
                        <Text>{`${treatmentData.boneMinutes} Minutes Bone Growth Stimulation`}</Text>
                        <Text>{`${treatmentData.muscleMinutes} Minutes Muscle Stimulation`}</Text>
                    </View>
                    <View style={styles.centeredContainer}>
                        <Pressable style={[buttonStyle]} onPress={() => {changeIsPlaying(); handlePress()}}>
                            <Text style={styles.text}>{buttonState}</Text>
                        </Pressable>
                    </View>
                </View>
            ): (
                <View style={styles.centeredContainer}>
                    <Text style={styles.noTreatmentsText}>No Treatments Today</Text>
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
    startButton:{
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 14,
        backgroundColor: '#5A7CF6',
        boxShadow: '0px 4px 17.5px 0px',
        width: 174,
        height: 46,
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
        justifyContent: 'center',
        alignItems: 'center',
    }

});
