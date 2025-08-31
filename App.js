import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Task from './Components/Task';
import AddTaskScreen from './Components/AddTaskScreen';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [taskItems, setTaskItems] = useState([]);

  // Load tasks from storage on app start
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage
  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.log('Error saving tasks:', error);
    }
  };

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTaskItems(JSON.parse(savedTasks));
      } else {
        setTaskItems([]);
      }
    } catch (error) {
      console.log('Error loading tasks:', error);
      setTaskItems([]); // Fallback to empty array
    }
  };

  // Add new task
  const addTask = (newTask) => {
    const updatedTasks = [...taskItems, newTask];
    setTaskItems(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Update an existing task
  const updateTask = (updatedTask) => {
    const updatedTasks = taskItems.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTaskItems(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Toggle task completion
  const toggleTask = (taskId) => {
    const updatedTasks = taskItems.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    );
    setTaskItems(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Delete task
  const deleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedTasks = taskItems.filter(task => task.id !== taskId);
            setTaskItems(updatedTasks);
            saveTasks(updatedTasks);
          }
        }
      ]
    );
  };

  // Toggle small goal completion
  const toggleSmallGoal = (taskId, smallGoalIndex) => {
    const updatedTasks = taskItems.map(task => {
      if (task.id === taskId && task.smallGoals && task.smallGoals[smallGoalIndex]) {
        const updatedSmallGoals = [...task.smallGoals];
        updatedSmallGoals[smallGoalIndex] = {
          ...updatedSmallGoals[smallGoalIndex],
          completed: !updatedSmallGoals[smallGoalIndex].completed
        };
        return { ...task, smallGoals: updatedSmallGoals };
      }
      return task;
    });
    setTaskItems(updatedTasks);
    saveTasks(updatedTasks);
  };

  // New function to handle editing a task
  const handleEdit = (taskToEdit) => {
    navigation.navigate('AddTask', {
      updateTask: updateTask,
      existingTask: taskToEdit,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Your Goals</Text>
        <Text style={styles.subtitle}>
          {taskItems.filter(task => !task.completed).length} active • {taskItems.filter(task => task.completed).length} completed
        </Text>
        
        <ScrollView 
          style={styles.items}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {taskItems.length > 0 ? taskItems.map((item, index) => (
            <Task 
              key={item.id} 
              task={item}
              onToggle={() => toggleTask(item.id)}
              onDelete={() => deleteTask(item.id)}
              onToggleSmallGoal={toggleSmallGoal}
              onEdit={handleEdit}
            />
          )) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>🎯</Text>
              <Text style={styles.emptyStateTitle}>No Goals Yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Tap the + button to create your first goal!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddTask', { addTask })}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0d11ff' },
          headerTintColor: '#29ab4cff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen}
          options={{ 
            title: 'Add New Goal',
            presentation: 'modal'
          }}
        />
      </Stack.Navigator>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#29ab4cff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#29ab4cff',
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#29ab4cff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2e2e2fff',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 60,
  },
  saveButton: {
    backgroundColor: '#29ab4cff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
