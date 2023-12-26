import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

const Home = ({navigation}: HomeProps) => {
  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.newWorkoutButton}
          onPress={() => navigation.navigate('AddWorkout')}>
            <Text style={styles.newWorkoutText}>Start Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newWorkoutButton}
          onPress={() => navigation.navigate('History')}>
            <Text style={styles.newWorkoutText}>View History</Text>
        </TouchableOpacity>
    </SafeAreaView>

  );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
    },
    newWorkoutButton: {
      backgroundColor: '#D9D9D9',
      margin: 15,
      justifyContent: 'center',
    },
    newWorkoutText: {
      fontSize: 32,
      textAlign: 'center',
      color: 'black',
      paddingVertical: 5,

    },
});
