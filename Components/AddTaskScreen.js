import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTaskScreen = ({ navigation, route }) => {
  // Use a fallback to prevent destructuring errors if `route.params` is empty
  const { addTask, updateTask, existingTask } = route.params || {};

  const [title, setTitle] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [newSmallGoalText, setNewSmallGoalText] = useState('');
  const [newSmallGoalTime, setNewSmallGoalTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [weeklyGoals, setWeeklyGoals] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Use a useEffect hook to populate the state with existing task data if in edit mode
  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setWeeklyGoals(existingTask.weeklyGoals);
    }
  }, [existingTask]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    if (existingTask) {
      // Logic for editing an existing task
      const updatedTask = {
        ...existingTask,
        title: title.trim(),
        weeklyGoals: weeklyGoals,
      };
      if (updateTask) {
        updateTask(updatedTask);
      }
    } else {
      // Logic for creating a new task
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        isMainGoal: true,
        completed: false,
        createdAt: new Date().toISOString(),
        weeklyGoals: weeklyGoals,
      };
      if (addTask) {
        addTask(newTask);
      }
    }
    navigation.goBack();
  };

  const addSmallGoal = () => {
    if (!selectedDay) {
      Alert.alert('Error', 'Please select a day');
      return;
    }

    if (!newSmallGoalText.trim()) {
      Alert.alert('Error', 'Please enter a goal description');
      return;
    }

    const newSmallGoal = {
      id: Date.now().toString(),
      text: newSmallGoalText.trim(),
      reminderTime: newSmallGoalTime.toISOString(),
      completed: false,
    };

    setWeeklyGoals(prev => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newSmallGoal]
    }));

    setNewSmallGoalText('');
    setNewSmallGoalTime(new Date());
  };

  const removeSmallGoal = (day, goalIndex) => {
    setWeeklyGoals(prev => ({
      ...prev,
      [day]: prev[day].filter((_, index) => index !== goalIndex)
    }));
  };

  // This function now handles the selected time and explicitly closes the picker on Android.
  const onTimeChange = (event, selectedTime) => {
    // Hide the picker on Android after selection or dismissal
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    // Update the time state only if a valid time was selected
    if (selectedTime) {
      setNewSmallGoalTime(selectedTime);
    }
  };

  const formatTime = (time) => {
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    return timeObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTotalGoalsForDay = (day) => {
    return weeklyGoals[day].length;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.label}>Big Goal Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your main goal..."
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
            multiline
            maxLength={200}
          />

          <Text style={styles.label}>Weekly Smaller Goals</Text>
          <Text style={styles.sublabel}>
            Select a day and add smaller goals with reminder times
          </Text>

          {/* Day Selection */}
          <View style={styles.daySelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDay === day && styles.selectedDayButton
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    selectedDay === day && styles.selectedDayButtonText
                  ]}>
                    {day.substring(0, 3)}
                  </Text>
                  {getTotalGoalsForDay(day) > 0 && (
                    <View style={styles.goalCountBadge}>
                      <Text style={styles.goalCountText}>
                        {getTotalGoalsForDay(day)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Add Goal Form */}
          {selectedDay && (
            <View style={styles.addGoalSection}>
              <Text style={styles.selectedDayLabel}>
                Adding goals for {selectedDay}
              </Text>
              
              <TextInput
                style={styles.goalInput}
                placeholder="Enter smaller goal..."
                placeholderTextColor="#666"
                value={newSmallGoalText}
                onChangeText={setNewSmallGoalText}
                multiline
              />

              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>Reminder Time:</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formatTime(newSmallGoalTime)}
                  </Text>
                </TouchableOpacity>
              </View>

              {showTimePicker && (
                <DateTimePicker
                  value={newSmallGoalTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onTimeChange}
                />
              )}

              <TouchableOpacity style={styles.addGoalButton} onPress={addSmallGoal}>
                <Text style={styles.addGoalButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Display Goals for Selected Day */}
          {selectedDay && weeklyGoals[selectedDay].length > 0 && (
            <View style={styles.goalsListSection}>
              <Text style={styles.goalsListTitle}>
                Goals for {selectedDay}
              </Text>
              {weeklyGoals[selectedDay].map((goal, index) => (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalText}>{goal.text}</Text>
                    <Text style={styles.goalTime}>
                      Reminder: {formatTime(goal.reminderTime)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeSmallGoal(selectedDay, index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Summary of all goals */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Weekly Goals Summary</Text>
            {daysOfWeek.map((day) => (
              weeklyGoals[day].length > 0 && (
                <View key={day} style={styles.summaryDay}>
                  <Text style={styles.summaryDayTitle}>
                    {day} ({weeklyGoals[day].length} goal{weeklyGoals[day].length !== 1 ? 's' : ''})
                  </Text>
                  {weeklyGoals[day].map((goal, index) => (
                    <Text key={goal.id} style={styles.summaryGoalText}>
                      • {goal.text} - {formatTime(goal.reminderTime)}
                    </Text>
                  ))}
                </View>
              )
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{existingTask ? 'Save Changes' : 'Create Goal'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0d11ff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
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
  sublabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2e2e2fff',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 24,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  daySelector: {
    marginBottom: 20,
    height: 50,
  },
  dayButton: {
    backgroundColor: '#2e2e2fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  selectedDayButton: {
    backgroundColor: '#29ab4cff',
  },
  dayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDayButtonText: {
    fontWeight: 'bold',
  },
  goalCountBadge: {
    position: 'absolute',
    top: -1,
    right: -4,
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  goalCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addGoalSection: {
    backgroundColor: '#1a1d21',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedDayLabel: {
    color: '#29ab4cff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  goalInput: {
    backgroundColor: '#2e2e2fff',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 12,
    flex: 1,
  },
  timeButton: {
    backgroundColor: '#29ab4cff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addGoalButton: {
    backgroundColor: '#29ab4cff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addGoalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  goalsListSection: {
    marginBottom: 20,
  },
  goalsListTitle: {
    color: '#29ab4cff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1d21',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  goalInfo: {
    flex: 1,
  },
  goalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  goalTime: {
    color: '#29ab4cff',
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summarySection: {
    backgroundColor: '#1a1d21',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  summaryTitle: {
    color: '#29ab4cff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryDay: {
    marginBottom: 12,
  },
  summaryDayTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryGoalText: {
    color: '#29ab4cff',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 2,
    lineHeight: 25,
  },
  saveButton: {
    backgroundColor: '#29ab4cff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default AddTaskScreen;
