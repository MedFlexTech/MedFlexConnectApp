import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp } from '@react-navigation/native';
import { TimerProvider } from './frontend/services/TimerContext.js';

import HomeScreen from "./frontend/screens/HomeScreen.js";
import ProfileScreen from "./frontend/screens/ProfileScreen.js";
import HelpScreen from "./frontend/screens/HelpScreen.js";
import StartTreatmentScreen from './frontend/screens/StartTreatmentScreen.js';
import CalendarScreen from './frontend/screens/CalendarScreen.js';
import JournalScreen from './frontend/screens/JournalScreen.js';
import HistoryScreen from './frontend/screens/HistoryScreen.js';
import LoginScreen from './frontend/screens/LoginScreen.js';

// Tab Bottom
const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();

function HomeStackGroup(){
  return(
      <HomeStack.Navigator
          screenOptions={{headerShown: false}}>
          <HomeStack.Screen name="Home" component={HomeScreen}/>
          <HomeStack.Screen name="StartTreatment" component={StartTreatmentScreen}/>
          <HomeStack.Screen name="Calendar" component={CalendarScreen}/>
          <HomeStack.Screen name="Journal" component={JournalScreen}/>
          <HomeStack.Screen name="History" component={HistoryScreen}/>
      </HomeStack.Navigator>
  )
}

function TabGroup(){
  return(
      <Tab.Navigator initialRouteName='HomeStackGroup'
      screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
        tabBarIcon: ({ color, focused, size }: { color: string; focused: boolean; size: number }) => {
                let iconName;
                if(route.name === "Profile"){
                  iconName = focused ? 'person' : 'person-outline';
                } else if(route.name === "HomeStackGroup"){
                  iconName = focused ? 'home' : 'home-outline';
                } else if(route.name === "Help"){
                  iconName = focused ? 'help-circle' : 'help-circle-outline';
                }
                  return <Ionicons name={iconName} size={size} color={color}/>;
              },
              tabBarActiveTintColor: "#5A7CF6",
              tabBarInactiveTintColor: "#9F9FA0",
              headerShown: false
          })}
      >
          <Tab.Screen name="Profile" component={ProfileScreen}/>
          <Tab.Screen name="HomeStackGroup" component={HomeStackGroup} options={{tabBarLabel:"Home"}}/>
          <Tab.Screen name="Help" component={HelpScreen} />
      </Tab.Navigator>
  )
}

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null; // or a loading spinner, if you would like to add one

  return (
    <NavigationContainer>
      <TimerProvider>
        {user ? <TabGroup /> : <LoginScreen />}
      </TimerProvider>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

