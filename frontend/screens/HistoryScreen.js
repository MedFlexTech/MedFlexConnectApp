import React from 'react';
import { SafeAreaView, View, Image, ScrollView, Text, StyleSheet } from 'react-native';

function HistoryScreen(props) {

    const getCurrentDate = () =>{
        const theMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let date = new Date();
        let month = theMonths[date.getMonth()];
        let day = date.getDate();
        let year = date.getFullYear();
        return month + " " + day + ", " + year;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>History</Text>
                    <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
            <View>
                <Text>Treatments</Text>
            </View>
            <View>
                <Text>Statistics</Text>
            </View>
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
    date:{
        marginLeft: '7%',
        textAlign: 'left', 
        color: 'white',
        fontSize: 12,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#5C80FC',
        fontFamily: 'Roboto', 
      },
  });

export default HistoryScreen;