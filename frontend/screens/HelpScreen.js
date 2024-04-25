import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Accordion from 'react-native-collapsible/Accordion';
import { SafeAreaView, Button, ScrollView, Image, Text, View, Pressable, StyleSheet } from 'react-native';

function HelpScreen(props) {

    const [ activeSections, setActiveSections ] = useState([]);
    const sections = [
        {
        title: 'Connect your device',
        content: <Text style={styles.textSmall}>
            Add information about connecting to a device here.
        </Text>
        },
        {
        title: 'Start your treatment',
        content: <Text style={styles.textSmall}>
            Add information here.
        </Text>
        },
        {
        title: 'Journaling',
        content:  <><Text style={styles.textSmall}>Add information here.</Text>
            <View style={styles.seperator}></View>
        </>
        },
        {
            title: 'Export treatment history',
            content:  <><Text style={styles.textSmall}>Add information here.</Text>
            <View style={styles.seperator}></View>
            </>
        },
        {
            title: 'About your privacy',
            content:  <><Text style={styles.textSmall}>Add information here.</Text>
            <View style={styles.seperator}></View>
            </>
        },
    ];

    function renderHeader(section, _, isActive) {
        return (
        <View style={styles.accordHeader}>
            <Text style={styles.accordTitle}>{ section.title }</Text>
            <Icon name={ isActive ? 'chevron-up' : 'chevron-down' }
                size={20} color="#bbb" />
        </View>
        );
    };

    function renderContent(section, _, isActive) {
        return (
        <View style={styles.accordBody}>
            {section.content}
        </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.heading}>
                <Image source={require('../assets/Squiggles.jpg')} style={styles.squiggle}/>
                    <Text style={styles.greeting}>Help</Text>
            </View>
            <View style={styles.content}>
                <Accordion
                align="bottom"
                sections={sections}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={(sections) => setActiveSections(sections)}
                sectionContainerStyle={styles.accordContainer}
            />
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
    content: {
        marginTop: '7%'
    },

    accordContainer: {
        paddingBottom: 4,
    },
    accordHeader: {
        padding: 14,
        backgroundColor: '#FFF',
        color: '#eee',
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    accordTitle: {
        fontSize: 20,
    },
    accordBody: {
        padding: 12
    },
    textSmall: {
        fontSize: 16
    },
  });

export default HelpScreen;