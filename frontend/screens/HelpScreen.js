import React from 'react';
import { SafeAreaView, ScrollView, Image, Text, View, Pressable, StyleSheet } from 'react-native';

function HelpScreen(props) {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>Help</Text>
            </View>
            <Pressable style={styles.button} onPress={() => {/* logic to expand menu */}}>
                <Text style={styles.buttonText}>Connect your device</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {/* logic to expand menu */}}>
                <Text style={styles.buttonText}>Start your treatment</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={{/* logic to expand menu */}}>
                <Text style={styles.buttonText}>Journaling</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={{/* logic to expand menu */}}>
                <Text style={styles.buttonText}>Export treatment history</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={{/* logic to expand menu */}}>
                <Text style={styles.buttonText}>About your privacy</Text>
            </Pressable>
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
    button: {
      marginHorizontal: 20,
      marginTop: 10,
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      alignItems: 'flex-start',
      elevation: 3, // For Android shadow
      shadowOpacity: 0.1, // For iOS shadow
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#5C80FC',
        fontFamily: 'Roboto', 
      },
  });

export default HelpScreen;