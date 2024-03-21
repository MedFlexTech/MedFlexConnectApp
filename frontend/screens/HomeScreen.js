import React from 'react';
import { Button, Text, StyleSheet, SafeAreaView, View, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function HomeScreen(props) {
    const { navigate } = useNavigation();

    const getCurrentDate = () =>{
        const theMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let date = new Date();
        let month = theMonths[date.getMonth()];
        let day = date.getDate();
        let year = date.getFullYear();
        return month + " " + day + ", " + year;
    }

    const getGreeting = () =>{
        let date = new Date();
        if(date.getHours() >= 18){
            return "Good Evening"
        }
        else if(date.getHours() >= 12){
            return "Good Afternoon"
        }
        else{
            return "Good Morning"
        }
    }
    return (
        
        <View style={styles.container}>
             <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                    <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
           <View style={styles.statusBox}>
                <Text>Device Status</Text>
                {/*Determine if device is connected here*/}
            </View>

            <View>
                <Pressable style={styles.button} onPress={() => navigate('StartTreatment')}>
                    <Text>Start Treatment</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigate('Calendar')}>
                    <Text>Calendar</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigate('Journal')}>
                    <Text>Journal</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigate('History')}>
                    <Text>History</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
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

    }
});

export default HomeScreen;