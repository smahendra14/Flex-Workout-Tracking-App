import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';

// Props interface 
interface ExerciseDropdownProps {
  onExerciseSelect: (exercise: { label: string, value: string, muscleGroup: string }) => void;
  muscleGroupFilter?: string; // Optional filter by muscle group
}

const ExerciseDropdown: React.FC<ExerciseDropdownProps> = ({ 
  onExerciseSelect, 
  muscleGroupFilter 
}) => {
  const [exerciseData, setExerciseData] = useState([]);
  const [value, setValue] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for new exercise input
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseMuscleGroup, setNewExerciseMuscleGroup] = useState('');

  // Muscle group options
  const muscleGroupOptions = [
    'chest', 'shoulders', 'back', 'biceps', 
    'triceps', 'legs', 'core'
  ];

  // Capitalize each word (matching your existing capitalization method)
  const capitalizeEachWord = (str) => {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch exercises from Firestore on component mount
  useEffect(() => {
    const subscriber = firestore()
      .collection('StoredExerciseOptions')
      .onSnapshot(
        querySnapshot => {
          const exercises = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          setExerciseData(exercises);
          setIsLoading(false);
        },
        error => {
          console.error("Error fetching exercises:", error);
          Alert.alert('Error', 'Could not fetch exercises');
          setIsLoading(false);
        }
      );

    // Unsubscribe from firestore listener on unmount
    return () => subscriber();
  }, []);

  // Filter exercises if muscleGroupFilter is provided
  const filteredExercises = muscleGroupFilter 
    ? exerciseData.filter(exercise => 
        exercise.muscleGroup.toLowerCase() === muscleGroupFilter
      )
    : exerciseData;

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name || item.label}</Text>
        <Text style={styles.muscleGroupText}>({item.muscleGroup})</Text>
      </View>
    );
  };

  const handleAddExercise = async () => {
    // Validate input
    if (!newExerciseName.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }

    if (!newExerciseMuscleGroup) {
      Alert.alert('Error', 'Please select a muscle group');
      return;
    }

    try {
      // Check if exercise already exists
      const existingExercises = await firestore()
        .collection('exercises')
        .where('name', '==', capitalizeEachWord(newExerciseName.trim()))
        .get();

      if (!existingExercises.empty) {
        Alert.alert('Error', 'This exercise already exists');
        return;
      }

      // Create new exercise object
      const newExercise = {
        name: capitalizeEachWord(newExerciseName.trim()),
        muscleGroup: capitalizeEachWord(newExerciseMuscleGroup),
        createdAt: firestore.FieldValue.serverTimestamp()
      };

      // Add to Firestore
      await firestore()
        .collection('exercises')
        .add(newExercise);

      // Reset modal state
      setNewExerciseName('');
      setNewExerciseMuscleGroup('');
      setIsAddModalVisible(false);

      Alert.alert('Success', 'Exercise added successfully');
    } catch (error) {
      console.error("Error adding exercise:", error);
      Alert.alert('Error', 'Could not add exercise');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading exercises...</Text>
      </View>
    );
  }

  return (
    <View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={filteredExercises}
        search
        maxHeight={300}
        labelField="name"
        valueField="name"
        placeholder="Select Exercise"
        searchPlaceholder="Search exercises..."
        value={value}
        onChange={item => {
          setValue(item.name);
          onExerciseSelect({
            label: item.name,
            value: item.name.toLowerCase().replace(/\s+/g, '_'),
            muscleGroup: item.muscleGroup
          });
        }}
        renderItem={renderItem}
      />

      {/* Add Exercise Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Exercise</Text>
      </TouchableOpacity>

      {/* Add Exercise Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Exercise</Text>
            
            {/* Exercise Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
            />

            {/* Muscle Group Dropdown */}
            <Dropdown
              style={styles.modalDropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={muscleGroupOptions.map(group => ({ 
                label: capitalizeEachWord(group), 
                value: group 
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Muscle Group"
              value={newExerciseMuscleGroup}
              onChange={item => setNewExerciseMuscleGroup(item.value)}
            />

            {/* Modal Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddExercise}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExerciseDropdown;

const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // ... (rest of the styles from previous version)
});