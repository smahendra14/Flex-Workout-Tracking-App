/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, Text} from 'react-native';

//Navigation
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

//screens
import Home from './screens/Home';
import AddWorkout from './screens/AddWorkout';
import FormikNewExercise from './screens/FormikNewExercise';
import History from './screens/History';

export type RootStackParamList = {
    Home: undefined;
    AddWorkout: undefined;
    NewExercise: undefined;
    FormikNewExercie: undefined;
    History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName='Home'
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen
                    name='Home'
                    component={Home}
                />
                <Stack.Screen
                    name='AddWorkout'
                    component={AddWorkout}
                />
                <Stack.Screen
                    name='FormikNewExercise'
                    component={FormikNewExercise}
                />
                <Stack.Screen
                    name='History'
                    component={History}
                />
            </Stack.Navigator>
        </NavigationContainer>    
    );
}

export default App;
