import React, {useState, useEffect} from 'react';
import {View, Text, Pressablen, StyleSheet} from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';


function CalendarScreen(props) {
  
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [treatmentInfo, setTreatmentInfo] = useState(null);

  useEffect(() => {
    prepareMarkedDates();
  }, []);

  const onDayPress = async (day) => {
    // Fetch treatment information for the selected date
    // Update treatment information display based on the selected date
    const formattedMonth = String(day.month).padStart(2, '0');
  const formattedDay = String(day.day).padStart(2, '0');
    const formattedDate = `${formattedMonth}-${formattedDay}-${day.year}`;
    setSelectedDate(formattedDate);
    await fetchTreatmentInfo(formattedDate);
  };

  const fetchTreatmentInfo = async (date) => {
    try {
      console.log(date);
      // Fetch treatment info based on the selected date
      const treatmentCollection = await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('treatments').where('date', '==', date).get();

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
  };


  const prepareMarkedDates = async () => {
    // Logic to set green or red dots based on treatment completion
    // This data might come from your Firebase database
    const treatmentCollection = await firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('treatments').get();
    let newMarkedDates = {};

    treatmentCollection.forEach((doc) =>{
      const data = doc.data();
      const dateParts = data.date.split('-'); // splits the date into [mm, dd, yyyy]
      const dateKey = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
      const completedStatus = data.completed ? 'green':'red';

      newMarkedDates[dateKey]={
        marked:true,
        dotColor: completedStatus,
      };
    })
    console.log(newMarkedDates);
    setMarkedDates(newMarkedDates);
  };

  return (
    <View style = {StyleSheet.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        // Additional styling and configuration props
      />
      {selectedDate && (
        <Text>{selectedDate}</Text>
      )}
      {treatmentInfo ? (
        <View style={styles.treatmentDetailsContainer}>
          <Text>Bone Minutes: {treatmentInfo.boneMinutes}</Text>
          <Text>Muscle Minutes: {treatmentInfo.muscleMinutes}</Text>
          <Text>Completed: {treatmentInfo.completed ? 'Yes' : 'No'}</Text>
          {/* ... display other treatment info as needed ... */}
        </View>
      ) : selectedDate ? (
        <View style={styles.TreatmentContainer}>
          <Text style={styles.TreatmentText}>No Treatments Today</Text>
        </View>
      ) : null}

    </View>
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
  },
  TreatmentText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default CalendarScreen;
