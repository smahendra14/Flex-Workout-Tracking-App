import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';

// screens
import AddWorkout from './AddWorkout';

// Form validation
import * as Yup from 'yup';
import { Formik } from 'formik';

const exerciseSchema = Yup.object().shape({
    name: Yup.string().required('Exercise name is required'),
    reps: Yup.number().required('Number of reps is required').positive().integer(),
    sets: Yup.number().required('Number of sets is required').positive().integer(),
    weight: Yup.number().required('Weight is required').min(0, 'Weight can not be negative'),
    rest: Yup.number().required('Rest is required').positive().integer(),
});
    //

// Firestore
import firestore from '@react-native-firebase/firestore';


const FormikNewExercise = ({navigation}) => {

    const capitalizeEachWord = (str) => {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const storeExerciseInfo = (values) => {
        firestore().collection('exercises').add({
            name: capitalizeEachWord(values.name),
            reps: parseInt(values.reps, 10),
            sets: parseInt(values.sets, 10),
            weight: parseFloat(values.weight),
            rest: parseInt(values.rest, 10),
            notes: values.notes,
        });
    };

    return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        Complete the Fields Below to Add a New Exercise to Your Workout
      </Text>
      <Formik
       initialValues={{ name: '', reps: '', sets: '', weight: '', rest: '', notes: ''}}
       validationSchema={exerciseSchema}
       onSubmit={ values => {
        console.log(values);
        storeExerciseInfo(values);
        navigation.navigate(AddWorkout);
       }}
     >
       {({
         values,
         isValid,
         handleChange,
         handleSubmit,
       }) => (
         <>
            <TextInput
                style={styles.wideInput}
                placeholder="Exercise Name"
                value={values.name}
                onChangeText={handleChange('name')}
            />
            <View style={styles.halfInputContainer}>
                <TextInput
                    style={styles.halfInput}
                    placeholder="Sets"
                    keyboardType="numeric"
                    value={values.sets}
                    onChangeText={handleChange('sets')}
                />
                <TextInput
                    style={styles.halfInput}
                    placeholder="Reps"
                    keyboardType="numeric"
                    value={values.reps}
                    onChangeText={handleChange('reps')}
                />
            </View>
            <View style={styles.halfInputContainer}>
                <TextInput
                    style={styles.halfInput}
                    placeholder="Weight"
                    keyboardType="numeric"
                    value={values.weight}
                    onChangeText={handleChange('weight')}
                />
                <TextInput
                    style={styles.halfInput}
                    placeholder="Rest (sec.)"
                    keyboardType="numeric"
                    value={values.rest}
                    onChangeText={handleChange('rest')}

                />
            </View>
            <TextInput
                style={styles.wideInput}
                placeholder="Notes"
                multiline
                value={values.notes}
                onChangeText={handleChange('notes')}
            />
            <TouchableOpacity
                disabled={!isValid}
                style={isValid ? styles.button : styles.disabledButton}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>
                    Save Exercise to Workout
                </Text>
            </TouchableOpacity>
         </>
       )}
     </Formik>
    </SafeAreaView>
  );
};

export default FormikNewExercise;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    headerText: {
        textAlign: 'center',
        fontSize: 22,
        color: 'black',
        margin: 15,
    },
    wideInput: {
        backgroundColor: '#D9D9D9',
        margin: 15,
        padding: 15,
    },
    halfInput: {
        backgroundColor: '#D9D9D9',
        margin: 15,
        width: '40%',
        padding: 15,
    },
    halfInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        margin: 15,
        backgroundColor: '#139E29',
        height: 50,
        justifyContent: 'center',
    },
    disabledButton: {
        margin: 15,
        backgroundColor: '#139E29',
        height: 50,
        justifyContent: 'center',
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24,
    },
});
