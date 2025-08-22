import React, {useState} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Task from './Components/Task';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [taskItems, setTaskItems] = useState([
    'Pass Final Exams',
    'Get Fit for Summer',
    'Learn React Native',
    'Complete Work Project'
  ]);
  
  return (
    <NavigationContainer>
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Active Tasks</Text>
        <ScrollView 
          style={styles.items}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {
            taskItems.map((item, index) => {
              return <Task key={index} text={item} />
            } )
          }
        </ScrollView>
      </View>
      
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => console.log('Navigate to form')}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0d11ff',
  },
  tasksWrapper:{
    paddingTop: 80,
    paddingHorizontal: 20,
    flex: 1,
  },
  sectionTitle:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#29ab4cff',
  },
  items:{
    marginTop: 30,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#29ab4cff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
  },
});