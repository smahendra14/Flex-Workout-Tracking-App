import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';

import FormikNewExercise from './FormikNewExercise';

// firebase
import firestore from '@react-native-firebase/firestore';


const AddWorkout = ({navigation}) => {

  const [exercises, setExercises] = useState([]);

  const handleSaveWorkout = async () => {
    const sourceCollection = 'exercises';
    const destinationCollection = `${getFormattedDate()}`;

    try {
      const snapshot = await firestore().collection(sourceCollection).get();

      const batch = firestore().batch();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        batch.set(firestore().collection(destinationCollection).doc(doc.id), data);
      });

      await batch.commit();

      // Reference to the "exercises" collection
      const exercisesCollectionRef = firestore().collection('exercises');

      // Get all documents in the collection
      const querySnapshot = await exercisesCollectionRef.get();

      // Delete each document in a batch
      const deleteBatch = firestore().batch();
      querySnapshot.forEach((doc) => {
        deleteBatch.delete(doc.ref);
      });

      // Commit the batch delete
      await deleteBatch.commit();

      console.log(`Data copied to ${destinationCollection}`);
    } catch (error) {
      console.error('Error copying data:', error);
    }
    navigation.navigate('Home');
  };

  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getData = async () => {
    try {
      const exerciseCollection = await firestore().collection('exercises').get();
      const exerciseData = exerciseCollection.docs.map((doc) => doc.data());
      setExercises(exerciseData);
      console.log(exerciseData);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate(FormikNewExercise)}
          >
              <Text style={styles.addText}>
                Add Exercise
              </Text>

          </TouchableOpacity>
        </View>
        <View style={styles.exerciseCardsContainer}>
          {exercises[0] ? null :
            <Text style={styles.emptyText}>Your exercises will appear here when added </Text>
          }
          <FlatList
            data={exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.exerciseCard}>
                <Text style={[styles.exerciseCardText, styles.exerciseCardTitle]}>{item.name}</Text>
                <View style={styles.exerciseCardBodyContainer}>
                  <Text style={styles.exerciseCardText}>Sets: {item.sets}</Text>
                  <Text style={styles.exerciseCardText}>Reps: {item.reps}</Text>
                  <Text style={styles.exerciseCardText}>Weight: {item.weight}</Text>
                  <Text style={styles.exerciseCardText}>Rest (sec.): {item.rest}</Text>
                  <Text style={styles.exerciseCardNotes}>Notes: {item.notes}</Text>
                </View>
              </View>
            )}
          />
        </View>
        <View style={styles.saveContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveWorkout}
        >
          <Text style={styles.saveButtonText}>Finish Workout</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

export default AddWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  buttonContainer: {
  },
  addButton: {
    backgroundColor: '#139E29',
    margin: 15,
    justifyContent: 'center',
  },
  addText: {
    fontSize: 32,
    textAlign: 'center',
    color: 'white',
    paddingVertical: 5,
  },
  exerciseCardsContainer: {
    flex: 6,
  },
  exerciseCard: {
    backgroundColor: '#bf5700',
    margin: 15,
  },
  exerciseCardText: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    textTransform: 'capitalize',
  },
  exerciseCardNotes: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
  },
  exerciseCardTitle: {
    fontSize: 24,
  },
  saveContainer: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#8a1111',
    margin: 15,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    padding: 5,
    fontSize: 32,
  },
  emptyView: {
    backgroundColor: '#bf5700',
    opacity: 0.5,
    margin: 15,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 24,
    margin: 15,
    textAlign: 'center',
    opacity: 0.6,
  },
});
