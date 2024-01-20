# Flex: Workout Tracker
A mobile app that allows users to keep track of their progress in the gym by logging their current workouts and seeing their workout history. 

# Features 

Adding Exercises: 

Users can add exercises to their current workout by entering the muscle group they are working on, the name of the exercise, number of sets & reps, weight, rest time, and any additional notes. 

Viewing History: 

Users can see their workout history from previous days using a calendar feature that displays the workouts they did on the selected day. Workouts are grouped by muscle group and information about sets, reps, and weight is displayed. 

# Frontend 
The frontend of the app was built using React Native CLI. React Navigation's Stack Navigator was used to allow users to move between different screens of the app. Formik and Yup schema validation were used to ensure users were properly inputting their workout information when prompted. 


# Backend
The backend of the app is built with Firebase. The Firestore database was used to store a user's workouts and saves the workouts logged based on the current day. This allows users to access their workouts from previous days to see their progress over time. 
