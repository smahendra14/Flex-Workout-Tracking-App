import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';

import ExerciseDropdown from '../components/ExerciseDropdown';

// Muscle group options
const MUSCLE_GROUPS = [
  'Full Body', 
  'Chest', 
  'Back', 
  'Legs', 
  'Shoulders', 
  'Arms', 
  'Core'
];

const CreateTemplate = () => {
  // State for workout template
  const [workoutName, setWorkoutName] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [exercises, setExercises] = useState([]);
  
  // State for adding new exercise
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [newExerciseSets, setNewExerciseSets] = useState('3');
  const [newExerciseReps, setNewExerciseReps] = useState('10');

  // Add muscle group
  const toggleMuscleGroup = (group) => {
    setSelectedMuscleGroups(current => 
      current.includes(group)
        ? current.filter(g => g !== group)
        : [...current, group]
    );
  };

  // Add exercise to workout
  const addExercise = () => {
    if (selectedExercise) {
      const newExercise = {
        ...selectedExercise,
        sets: newExerciseSets,
        reps: newExerciseReps
      };
      setExercises(current => [...current, newExercise]);
      
      // Reset exercise input fields
      setSelectedExercise(null);
      setNewExerciseSets('3');
      setNewExerciseReps('10');
    }
  };

  // Remove exercise from workout
  const removeExercise = (indexToRemove) => {
    setExercises(current => 
      current.filter((_, index) => index !== indexToRemove)
    );
  };

  // Save workout template
  const saveWorkoutTemplate = () => {
    // Here you would typically save to your backend or local storage
    const workoutTemplate = {
      name: workoutName,
      muscleGroups: selectedMuscleGroups,
      exercises: exercises
    };
    
    console.log('Workout Template:', workoutTemplate);
    // Add your save logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Create Workout Template</Text>
        
        {/* Workout Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Workout Name"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
        
        {/* Muscle Group Selection */}
        <Text style={styles.sectionTitle}>Select Muscle Groups</Text>
        <View style={styles.muscleGroupContainer}>
          {MUSCLE_GROUPS.map(group => (
            <TouchableOpacity
              key={group}
              style={[
                styles.muscleGroupButton,
                selectedMuscleGroups.includes(group) && styles.selectedMuscleGroup
              ]}
              onPress={() => toggleMuscleGroup(group)}
            >
              <Text style={styles.muscleGroupText}>{group}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Add Exercise Section */}
        <Text style={styles.sectionTitle}>Add Exercises</Text>
        
        {/* Exercise Dropdown */}
        <ExerciseDropdown
          onExerciseSelect={setSelectedExercise}
          // Optionally, you can add muscle group filtering
          // muscleGroupFilter={selectedMuscleGroups[0]} 
        />
        
        {/* Exercise Details */}
        <View style={styles.exerciseDetailsContainer}>
          <View style={styles.exerciseInputContainer}>
            <Text>Sets:</Text>
            <TextInput
              style={styles.smallInput}
              value={newExerciseSets}
              onChangeText={setNewExerciseSets}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.exerciseInputContainer}>
            <Text>Reps:</Text>
            <TextInput
              style={styles.smallInput}
              value={newExerciseReps}
              onChangeText={setNewExerciseReps}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addExercise}
            disabled={!selectedExercise}
          >
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
        
        {/* Exercises List */}
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseListItem}>
            <Text>{exercise.label} - {exercise.sets} sets x {exercise.reps} reps</Text>
            <TouchableOpacity 
              onPress={() => removeExercise(index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveWorkoutTemplate}
        >
          <Text style={styles.saveButtonText}>Save Workout Template</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  muscleGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  muscleGroupButton: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    margin: 4,
    borderRadius: 8
  },
  selectedMuscleGroup: {
    backgroundColor: '#4CAF50'
  },
  muscleGroupText: {
    color: 'black'
  },
  exerciseDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  exerciseInputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 50,
    marginLeft: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'white'
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  exerciseListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  removeButton: {
    backgroundColor: '#F44336',
    padding: 6,
    borderRadius: 4
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 16
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  }
});

export default CreateTemplate;