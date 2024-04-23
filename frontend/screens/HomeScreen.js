import React , {useState, useEffect} from 'react';
import { Button, Text, StyleSheet, SafeAreaView, View, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BleService from '../services/BLEService.js';

function HomeScreen(props) {
    const { navigate } = useNavigation();
    const [deviceStatus, setDeviceStatus] = useState('No device connected');
    const [batteryStatus, setBatteryStatus] = useState('Cannot read battery percentage');
   
    useEffect(() => {
        const initializeBLE = async () => {
            BleService.initializeManager();
        };

        initializeBLE(); 
    }, []);

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

    const getBattery =  async () => {
        let result = '';
        try{
            await BleService.connectToDevice('DUO');
        }
        catch(error){
            console.log(error);
            return;
        }
        setDeviceStatus('Connected');
        try{
            let battery = await BleService.readBattery();
        }
        catch(error){
            console.log(error);
            return;
        }
        setBatteryStatus(battery);
    }
    return (
        
        <View style={styles.container}>
             <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                    <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
           <View style={styles.statusBox}>
                <Text style = {styles.statusTitle}>Device Status</Text>
                {/*Determine if device is connected here*/}
                <View style={styles.statusAlign}>
                    <Text style = {styles.statusText}>{deviceStatus}</Text>
                    <Text style = {styles.statusText}>{batteryStatus}</Text>
                </View>
            </View>

            <View>
                <Pressable style={styles.button} onPress={() => navigate('StartTreatment')}>
                    <Text style={styles.buttonText}>Start Treatment</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigate('Calendar')}>
                    <Text style={styles.buttonText}>Calendar</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigate('Journal')}>
                    <Text style={styles.buttonText}>Journal</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigate('History')}>
                    <Text style={styles.buttonText}>History</Text>
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 3, // For Android shadow
        shadowOpacity: 0.1, // For iOS shadow
    },
    buttonText:{
        fontSize: 18,
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
    statusTitle:{
        color: 'white',
        paddingLeft: '5%',
        paddingTop: '3%',
        paddingBottom: '1%',
        fontSize: 16
    },
    statusText:{
        color: 'white',
        paddingLeft: '5%',
    },
    statusAlign:{
        display: 'inline',
    }
});

export default HomeScreen;