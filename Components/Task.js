import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const Task = (props) => {
  const smallGoals = [
    { time: '5:30AM', text: 'Mon: Run 7Km' },
    { time: '6:00AM', text: 'Wed: Run 7Km' },
    { time: '5:45AM', text: 'Thurs: Run 7Km' },
    { time: '7:00AM', text: 'Fri: Run 7Km' },
    { time: '8:00AM', text: 'Sat: Run 10Km' },
    { time: '6:30AM', text: 'Sun: Rest Day' },
  ];

  return (
    <View style={styles.item}>
      <View style={styles.bigGoal}>
        <Text style={styles.itemText}>{props.text}</Text>
        <View style={styles.square}></View>
      </View>
      
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.smallGoalScrollContainer}
        contentContainerStyle={styles.smallGoalContent}
      >
        {smallGoals.map((goal, index) => (
          <View key={index} style={styles.smallGoalWrapper}>
            <Text style={styles.smallGoalTime}>{goal.time}</Text>
            <Text style={styles.smallGoalText}>{goal.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

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
  bigGoal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 30,
    width: '100%',
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#29ab4cff',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 5,
  },
  itemText: {
    maxWidth: '80%',
    fontSize: 32,
    color: '#FFFF',
    fontWeight: '700',
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
  smallGoalText: {
    fontSize: 28,
    color: '#ffff',
    fontWeight: '700',
    padding: 12,
    borderRadius: 18,
    flex: 1,
    textAlignVertical: 'center',
  },
});

export default Task;