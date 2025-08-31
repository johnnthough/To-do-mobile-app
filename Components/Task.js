import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

const Task = ({ task, onToggle, onDelete, onToggleSmallGoal, onEdit }) => {
  // Access weeklyGoals and create an array of objects, each containing a goal and its day.
  const allSmallGoals = Object.keys(task.weeklyGoals || {}).flatMap(day => {
    return task.weeklyGoals[day].map(goal => ({ ...goal, day: day }));
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const timeObj = new Date(timeString);
    return timeObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleLongPress = () => {
    Alert.alert(
      'Goal Options',
      task.title,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: task.completed ? 'Mark Incomplete' : 'Mark Complete',
          onPress: onToggle
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: onDelete
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[
        styles.item,
        task.completed && styles.completedItem
      ]}
      onLongPress={handleLongPress}
      // Add a single-press handler to navigate to the edit screen
      onPress={() => onEdit && onEdit(task)}
      activeOpacity={0.9}
    >
      <View style={styles.bigGoal}>
        <View style={styles.goalHeader}>
          <Text style={[
            styles.itemText,
            task.completed && styles.completedText
          ]}>
            {task.title || task.text}
          </Text>
          <View style={styles.goalMeta}>
            <Text style={styles.dateText}>
              {formatDate(task.createdAt || new Date().toISOString())}
            </Text>
            {task.reminderEnabled && (
              <Text style={styles.reminderText}>🔔</Text>
            )}
            {task.isMainGoal && (
              <Text style={styles.mainGoalBadge}>🎯</Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.square,
            task.completed && styles.completedSquare
          ]}
          // Retain the toggle functionality on the checkbox
          onPress={onToggle}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.smallGoalScrollContainer}
        contentContainerStyle={styles.smallGoalContent}
      >
        {allSmallGoals.length > 0 ? allSmallGoals.map((goal, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.smallGoalWrapper,
              goal.completed && styles.completedSmallGoal
            ]}
            onPress={() => onToggleSmallGoal && onToggleSmallGoal(task.id, index)}
          >
            <Text style={styles.smallGoalTime}>{formatTime(goal.reminderTime)}</Text>
            {/* Show the day of the week */}
            <Text style={styles.smallGoalDay}>{goal.day}</Text>
            {/* Truncate text to 2 lines */}
            <Text 
              style={[
                styles.smallGoalText,
                goal.completed && styles.completedSmallGoalText
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {goal.text}
            </Text>
            {goal.completed && (
              <View style={styles.smallGoalCheck}>
                <Text style={styles.smallCheckmark}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        )) : (
          <View style={styles.noSmallGoals}>
            <Text style={styles.noSmallGoalsText}>No sub-goals yet. Add some to break down this goal!</Text>
          </View>
        )}
      </ScrollView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#2e2e2fff',
    padding: 16,
    borderRadius: 32,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  completedItem: {
    opacity: 0.7,
  },
  bigGoal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  goalHeader: {
    flex: 1,
    marginRight: 15,
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#29ab4cff',
    opacity: 0.4,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedSquare: {
    opacity: 1,
    backgroundColor: '#29ab4cff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 32,
    color: '#FFFF',
    fontWeight: '700',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  dateText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  reminderText: {
    fontSize: 14,
  },
  mainGoalBadge: {
    fontSize: 14,
  },
  smallGoalScrollContainer: {
    width: '100%',
    height: 150,
  },
  smallGoalContent: {
    paddingRight: 16,
  },
  smallGoalWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: 160,
    backgroundColor: '#29ab4cff',
    borderRadius: 18,
    height: 150,
    marginRight: 10,
    position: 'relative',
  },
  completedSmallGoal: {
    backgroundColor: '#1a4a1f',
    opacity: 0.8,
  },
  smallGoalTime: {
    fontSize: 13,
    backgroundColor: '#ffff',
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    textAlign: 'center',
    margin: 10,
    color: '#000',
  },
  smallGoalDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  smallGoalText: {
    fontSize: 28,
    color: '#ffff',
    fontWeight: '700',
    paddingHorizontal: 12,
    borderRadius: 18,
    flex: 1,
    textAlignVertical: 'center',
  },
  completedSmallGoalText: {
    textDecorationLine: 'line-through',
    color: '#ccc',
  },
  smallGoalCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    backgroundColor: '#29ab4cff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCheckmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noSmallGoals: {
    width: 200,
    height: 150,
    backgroundColor: '#444',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noSmallGoalsText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Task;
