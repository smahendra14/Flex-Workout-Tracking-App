import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View, FlatList, ActivityIndicator, Modal, TextInput, Button } from 'react-native';

// firebase
import firestore from '@react-native-firebase/firestore';

import { useNavigation } from '@react-navigation/native';

const WorkoutTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const db = firestore();

  // Fetch workout templates from Firebase
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const querySnapshot = await db.collection('WorkoutTemplates').get();
        const fetchedTemplates = [];
        querySnapshot.forEach(doc => {
          fetchedTemplates.push({ id: doc.id, ...doc.data() });
        });
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [db]);

  const saveTemplateChanges = async () => {
    if (selectedTemplate) {
      try {
        await db.collection('WorkoutTemplates').doc(selectedTemplate.id).update(selectedTemplate);
        setTemplates(prevTemplates => prevTemplates.map(template => 
          template.id === selectedTemplate.id ? selectedTemplate : template
        ));
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating template: ', error);
      }
    }
  };

  const renderTemplate = ({ item }) => (
    <View style={styles.templateCard}>
      <Text style={styles.templateName}>{item.templateName}</Text>
      <FlatList
        data={item.exercises}
        keyExtractor={(exercise, index) => `${item.id}-exercise-${index}`}
        renderItem={({ item: exercise }) => (
          <View style={styles.exerciseRow}>
            <Text style={styles.exerciseText}>{`${exercise.name} (${exercise.muscleGroup})`}</Text>
            <Text style={styles.exerciseText}>{`Sets: ${exercise.sets} | Reps: ${exercise.reps}`}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedTemplate({ ...item });
          setModalVisible(true);
        }}
      >
        <Text style={styles.editButtonText}>Edit Template</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#139E29" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.newTemplateBtn} 
        onPress={() => navigation.navigate('CreateTemplate')}>
        <Text style={styles.newTemplateBtnText}>Create New Template</Text>
      </TouchableOpacity>
      <FlatList
        data={templates}
        keyExtractor={item => item.id}
        renderItem={renderTemplate}
        contentContainerStyle={styles.templatesList}
      />

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Template</Text>
          <TextInput
            style={styles.input}
            placeholder="Template Name"
            value={selectedTemplate?.templateName}
            onChangeText={(text) => setSelectedTemplate(prev => ({ ...prev, templateName: text }))}
          />
          <FlatList
            data={selectedTemplate?.exercises}
            keyExtractor={(exercise, index) => `modal-exercise-${index}`}
            renderItem={({ item: exercise, index }) => (
              <>
              <Text>Exercise Name</Text>
              <View style={styles.exerciseEditorRow}>
                <TextInput
                  style={styles.exerciseInput}
                  placeholder="Exercise Name"
                  value={exercise.name}
                  onChangeText={(text) => {
                    const newExercises = [...selectedTemplate.exercises];
                    newExercises[index].name = text;
                    setSelectedTemplate(prev => ({ ...prev, exercises: newExercises }));
                  }}
                />
                <TextInput
                  style={styles.exerciseInput}
                  placeholder=""
                  value={exercise.sets ? exercise.sets.toString() : ''}
                  onChangeText={(text) => {
                    const newExercises = [...selectedTemplate.exercises];
                    newExercises[index].sets = Number(text);
                    setSelectedTemplate(prev => ({ ...prev, exercises: newExercises }));
                  }}
                />
                <TextInput
                  style={styles.exerciseInput}
                  placeholder=""
                  value={exercise.reps ? exercise.reps.toString() : ''}
                  onChangeText={(text) => {
                    const newExercises = [...selectedTemplate.exercises];
                    newExercises[index].reps = Number(text);
                    setSelectedTemplate(prev => ({ ...prev, exercises: newExercises }));
                  }}
                />
              </View>
              </>
            )}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveTemplateChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default WorkoutTemplates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  newTemplateBtn: {
    backgroundColor: '#139E29',
    margin: 15,
    justifyContent: 'center',
    borderRadius: 8,
    padding: 10,
  },
  newTemplateBtnText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  templatesList: {
    paddingHorizontal: 15,
  },
  templateCard: {
    backgroundColor: '#F5F5F5',
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  templateName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  exerciseText: {
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  exerciseEditorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  exerciseInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#139E29',
    borderRadius: 5,
    padding: 10,
    marginVertical: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
