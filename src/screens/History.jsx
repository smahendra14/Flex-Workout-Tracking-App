import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';

const History = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [exerciseHistory, setExerciseHistory] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  useEffect(() => {
    const fetchExerciseHistory = async () => {
      if (selectedDate) {
        try {
          // Use the selected date as the collection name
          const snapshot = await firestore().collection(selectedDate).get();

          const exercises = snapshot.docs.map((doc) => doc.data());
          setExerciseHistory(exercises);
        } catch (error) {
          console.error('Error fetching exercise history:', error);
        }
      }
    };

    fetchExerciseHistory();
  }, [selectedDate]);

  return (
    <View style={styles.container}>
        <Calendar onDayPress={handleDateSelect}/>

        <ScrollView style={styles.exerciseContainer}>
            {selectedDate && (
                <>
                <Text style={styles.headerText}>Exercise History for {selectedDate}:</Text>
                {exerciseHistory.map((exercise, index) => (
                    <View style={styles.exerciseCard} key={index}>
                        <Text style={styles.exerciseText}>{exercise.name}: {exercise.sets} x {exercise.reps} ({exercise.weight} lbs.)</Text>
                    </View>
                ))}
                </>
            )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
              <Text style={styles.buttonText}>
                Return Home
              </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 24,
    },
    exerciseContainer: {
    },
    exerciseCard: {
        backgroundColor: '#bf5700',
        margin : 10,
        marginHorizontal: 30,
    },
    exerciseText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 10,
    },
    button: {
        backgroundColor: '#139E29',
        margin: 15,
        justifyContent: 'center',
    },
    buttonText: {
      fontSize: 32,
      textAlign: 'center',
      color: 'white',
      paddingVertical: 5,
    },
});

export default History;
