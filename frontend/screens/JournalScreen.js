import React, { useState } from 'react';
import { SafeAreaView, View, Image, Text, TextInput, Pressable, StyleSheet, Alert} from 'react-native';
import Slider from '@react-native-community/slider';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';

function JournalScreen(props) {
    {/*Display and format date for the title*/}
    const getCurrentDate = () =>{
        const theMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let date = new Date();
        let month = theMonths[date.getMonth()];
        let day = date.getDate();
        let year = date.getFullYear();
        return month + " " + day + ", " + year;
    }

    const [feeling, setFeeling] = useState(0);
    const [painLevel, setPainLevel] = useState(0);
    const [comments, setComments] = useState('');



    const showConfirmationDialog = (action, message) => {
        Alert.alert(
        "Confirmation",
        message,
        [
            // Button to cancel the action
            {
            text: "Cancel",
            style: "cancel"
            },
            // Button to confirm the action
            {
            text: "Yes",
            onPress: () => {
                if (action === 'submit') {
                submitForm();
                } else if (action === 'clear') {
                clearForm();
                }
            }
            }
        ]
        );
    };

    const handleSubmit = () => {
        // Show confirmation dialog for submit
        showConfirmationDialog('submit', 'Are you sure you want to submit your journal entry?');
    };

    const handleClear = () => {
        // Show confirmation dialog for clear
        showConfirmationDialog('clear', 'Are you sure you want to clear the form?');
    };

    const submitForm = async () => {
        try {
            await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('journals').add({
                feeling,
                painLevel,
                comments,
                createdAt: firestore.FieldValue.serverTimestamp(),
              });
        // Reset the form or navigate away after submission
        clearForm();
        } catch (error) {
        console.error(error);
        }
    };

    const clearForm = () => {
        setFeeling(0);
        setPainLevel(0);
        setComments('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>Today's Treatment</Text>
                    <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
            <View>
                <Text>How are you feeling?</Text>
                <Slider
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={feeling}
                    onValueChange={setFeeling}
                />
            </View>
            <View> 
                <Text>How is the pain level of your injury?</Text>
                <Slider
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={painLevel}
                    onValueChange={setPainLevel}
                />
            </View>
            <View>
                <Text>Other comments for your prescriber</Text>
                <TextInput
                multiline
                placeholder="Type your response here..."
                value={comments}
                onChangeText={setComments}
                />

            </View>
            
            <View style={styles.twoButtons}>
                <Pressable style={styles.clear} onPress={(handleClear)}>
                    <Text style={styles.text}>Clear</Text>
                </Pressable>
                <Pressable style={styles.submit} onPress={(handleSubmit)}>
                    <Text style={styles.text}>Submit</Text>
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

    twoButtons:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10
    },
    submit:{
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 14,
        backgroundColor: '#5A7CF6',
        boxShadow: '0px 4px 17.5px 0px',
        width: 134,
        height: 46,
    },
    clear:{
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 14,
        backgroundColor: '#999',
        boxShadow: '0px 4px 17.5px 0px',
        width: 134,
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

export default JournalScreen;