import React, {useState, useEffect} from 'react';
import {View, Text, Pressablen, StyleSheet, ActivityIndicator} from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';


function CalendarScreen(props) {
  
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [treatmentInfo, setTreatmentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prepareMarkedDates();
  }, []);

  const onDayPress = async (day) => {
    // Fetch treatment information for the selected date
    // Update treatment information display based on the selected date
    console.log('day', day)
    setSelectedDate(day.dateString);
    let today = new Date(day.dateString)
    console.log('today', today);
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 to represent the beginning of the day

    // Construct a Timestamp object for today's date
    var startOfTodayTimestamp = firebase.firestore.Timestamp.fromDate(today);

    // Construct a Timestamp object for the end of today (just before midnight)
    var endOfTodayTimestamp = firebase.firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
            // actually returning the treatment            
    await fetchTreatmentInfo(startOfTodayTimestamp, endOfTodayTimestamp);
  };

  const fetchTreatmentInfo = async (start, end) => {
    try {
      console.log(start, end);
      // Fetch treatment info based on the selected date
      const treatmentCollection = await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('treatments').where("date", ">=", start).where("date", "<=", end).limit(1).get();

      const treatments = treatmentCollection.docs.map(doc => doc.data());
      console.log(treatments);
      if (treatments.length > 0) {
        // Assuming each date has only one treatment info
        setTreatmentInfo(treatments[0]);
      } else {
        setTreatmentInfo(null);
      }
    } catch (error) {
      console.log('Error fetching treatment info:', error);
      setTreatmentInfo(null);
    }
    /*setIsLoading(true);
    try {
      const treatmentDoc = await firestore()
        .collection('treatments')
        .doc(date)
        .get();

      if (treatmentDoc.exists) {
        setTreatmentInfo(treatmentDoc.data());
      } else {
        setTreatmentInfo(null);
      }
    } catch (error) {
      console.error("Error fetching treatment info: ", error);
      setTreatmentInfo(null);
    }
    setIsLoading(false);
  };*/

  };


  const prepareMarkedDates = async () => {
    // Logic to set green or red dots based on treatment completion
    // This data might come from your Firebase database
    const treatmentCollection = await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('treatments').get();
    let newMarkedDates = {};

    treatmentCollection.forEach((doc) =>{
      const data = doc.data();
     //const dateParts = data.date.split('-'); // splits the date into [mm, dd, yyyy]
    
      let dateKey = data.date.toDate();
      console.log(dateKey);
      dateKey = dateKey.toISOString().split('T')[0]
      console.log(dateKey);
      const completedStatus = data.completed ? 'green':'red';

      newMarkedDates[dateKey]={
        marked:true,
        dotColor: completedStatus,
      };
    })
    console.log('Marked dates: ', newMarkedDates);
    setMarkedDates(newMarkedDates);
  };

  const formatDate = (dateString) =>{
    let theDate = dateString.split('-');

    return theDate[1] + "/" + theDate[2] + "/" + theDate[0];
  }

  return (
    <View style = {StyleSheet.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        // Additional styling and configuration props
      />
      {selectedDate && (
        <View style={styles.TreatmentContainer}>
          <Text style={styles.selectedDate}>{formatDate(selectedDate)}</Text>
        </View>  
      )}
      {treatmentInfo ? (
        <View style={styles.TreatmentContainer}>
          <Text style={styles.TreatmentText}>Bone Minutes: {treatmentInfo.boneMinutes}</Text>
          <Text style={styles.TreatmentText}>Muscle Minutes: {treatmentInfo.muscleMinutes}</Text>
          <Text style={styles.TreatmentText}>{treatmentInfo.completed ? 'Complete' : 'Incomplete'}</Text>
          {/* ... display other treatment info as needed ... */}
        </View>
      ) : selectedDate ? (
        <View style={styles.TreatmentContainer}>
          <Text style={styles.TreatmentText}>No Treatments Today</Text>
        </View>
      ) : null}

    </View>
    /*
    <View style={{ flex: 1 }}>

      {isLoading && <ActivityIndicator size="large" />}
      {treatmentInfo ? (
        <View style={styles.TreatmentContainer}>
          <Text style={styles.TreatmentText}>Bone Minutes: {treatmentInfo.boneMinutes}</Text>
        </View>
      ) : selectedDate && !isLoading ? (
        <View style={styles.TreatmentContainer}>
          <Text style={styles.TreatmentText}>No Treatments Today</Text>
        </View>
      ) : null}
    </View>
    */
  );
}

const styles = StyleSheet.create({

  TreatmentContainer: {
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
    marginTop: 10
  },
  TreatmentText: {
    color: '#000000',
    fontSize: 16,
  },
  selectedDate:{
    color: '#000000',
    fontSize: 20,
    justifyContent: 'center'
  }
});

export default CalendarScreen;
