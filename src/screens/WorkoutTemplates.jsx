import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import React from 'react';
import CreateTemplate from './CreateTemplate';

const WorkoutTemplates = ({navigation}) => {


  return (
    <SafeAreaView style={styles.container}>
        <View>
            <TouchableOpacity 
                style={styles.newTemplateBtn} 
                onPress={() => navigation.navigate(CreateTemplate)}
            >
                <Text style={styles.newTemplateBtnText}>Create New Template</Text>
            </TouchableOpacity>
        </View>
        
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
  },
  newTemplateBtnText: {
    fontSize: 32,
    textAlign: 'center',
    color: 'white',
    paddingVertical: 5,
  },
});
