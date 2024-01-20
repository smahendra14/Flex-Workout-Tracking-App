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

  const capitalizeEachWord = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

  useEffect(() => {
    const fetchExerciseHistory = async () => {
      if (selectedDate) {
        try {
          // Use the selected date as the collection name
          const snapshot = await firestore().collection(selectedDate).get();

          const exercises = snapshot.docs.map((doc) => doc.data());  
          const groupedExercises = exercises.reduce((acc, exercise) => {
            const muscleGroup = exercise.muscleGroup || 'Other';
            acc[muscleGroup] = [...(acc[muscleGroup] || []), exercise];
            return acc;
          }, {});       
          setExerciseHistory(groupedExercises);
        } catch (error) {
          console.error('Error fetching exercise history:', error);
        }
      }
    };

    fetchExerciseHistory();
    console.log(exerciseHistory);
  }, [selectedDate]);

  return (
    <View style={styles.container}>
        <Calendar 
          style={styles.calendar} 
          onDayPress={handleDateSelect}
        />
        <Text style={styles.headerText}>Exercise History for {selectedDate}:</Text>
        <ScrollView style={styles.exerciseContainer}>
            {/* {selectedDate && (
                <>
                
                {exerciseHistory.map((exercise, index) => (
                    <View style={styles.exerciseCard} key={index}>
                        <Text style={styles.exerciseText}>{exercise.name}: {exercise.sets} x {exercise.reps} ({exercise.weight} lbs.)</Text>
                    </View>
                ))}
                </>
            )} */}
            {selectedDate &&
            Object.entries(exerciseHistory).map(([muscleGroup, groupExercises]) => (
            <View key={muscleGroup} style={styles.muscleGroupingContainer}>
              <Text style={styles.muscleGroupHeader}>{capitalizeEachWord(muscleGroup)}</Text>
              {groupExercises.map((exercise, index) => (
                <View style={styles.exerciseCard} key={index}>
                  <Text style={styles.exerciseText}>
                    {exercise.name}: {exercise.sets} x {exercise.reps} ({exercise.weight} lbs.)
                  </Text>
                </View>
              ))}
            </View>
          ))}
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
    calendar: {
      borderBottomWidth: 2,
      borderBottomColor: '#D9D9D9',
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
        marginHorizontal: 20,
        borderRadius: 12,
    },
    muscleGroupingContainer: {
      backgroundColor: '#D9D9D9',
      margin: 10,
      marginHorizontal: 30,
      borderRadius: 12,
      padding: 4,
    },
    muscleGroupHeader: {
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 4,
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