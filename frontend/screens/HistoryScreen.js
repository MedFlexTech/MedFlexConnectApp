import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, ScrollView, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

function HistoryScreen(props) {

    const widthAndHeight = 150;
    let [series, setSeries] = useState([]);
    const sliceColor = ['#39E829', '#FE5757', '#A6B7D4'];

    const getCurrentDate = () =>{
        const theMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let date = new Date();
        let month = theMonths[date.getMonth()];
        let day = date.getDate();
        let year = date.getFullYear();
        return month + " " + day + ", " + year;
    }

    useEffect(() => {
        const populateChart = async () =>{
        
            try{
                const userDocument = await firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
                const completedTreatments = userDocument.data().completedTreatments;
                const missedTreatments = userDocument.data().missedTreatments;
                const treatmentsRemaining = userDocument.data().treatmentsRemaining;
                console.log(treatmentsRemaining);
                if(treatmentsRemaining > 0){
                    let theSeries = [completedTreatments, missedTreatments, treatmentsRemaining];
                    setSeries(theSeries);
                }
            }
            catch(e){
                console.log(e);
            }
            
        }

        populateChart();
    }, [])
    

    return (
        <ScrollView style={styles.container}>
            <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>History</Text>
                    <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
            <View style={styles.treatmentContainer}>
                <Text>Treatments</Text>
                {series.length > 0 ? (
                    <View>
                <Text>Treatments Completed: {series[0]}</Text>
                <Text>Treatments Missed: {series[1]}</Text>
                <Text>Treatments Remaining: {series[2]}</Text>
                <View style={styles.centered}>
                <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
          </View>
          </View>
          ): (<Text>No treatments yet</Text>)}
            </View>
            <View>
                {/* <Text>Statistics</Text> */}
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
      centered:{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
      },
      treatmentContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 50,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        margin: 10
      },
  });

export default HistoryScreen;