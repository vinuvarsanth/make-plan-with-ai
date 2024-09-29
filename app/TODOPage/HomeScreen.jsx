import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../../configs/FirebaseConfig';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('low');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const user = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const tasksList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTasks(tasksList);
    } catch (error) {
      console.error(error);
    }
  };

  const saveTaskToFirebase = async (newTaskObject) => {
    try {
      await addDoc(collection(db, 'tasks'), newTaskObject);
      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = () => {
    if (newTask !== '' && dueDate !== '' && user) {
      const newTaskObject = {
        task: newTask,
        priority,
        dueDate,
        completed: false,
        userId: user.uid,
      };
      saveTaskToFirebase(newTaskObject);
      setNewTask('');
      setPriority('low');
      setDueDate('');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleCompleted = async (id, completed) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, { completed: !completed });
      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate.toLocaleDateString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ultimate To-Do List</Text>

      {/* Input Field and Buttons */}
      <TextInput
        style={styles.input}
        value={newTask}
        onChangeText={(text) => setNewTask(text)}
        placeholder="Add new task"
        placeholderTextColor="#A0A0A0"
      />

      {/* Priority and Date in One Line */}
      <View style={styles.pickerRow}>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Low Priority" value="low" />
          <Picker.Item label="Medium Priority" value="medium" />
          <Picker.Item label="High Priority" value="high" />
        </Picker>

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>{dueDate ? `Due Date: ${dueDate}` : 'Select Due Date'}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>
              {item.task} 
              <Text style={styles.subText}> (Priority: {item.priority}, Due: {item.dueDate})</Text>
            </Text>
            <View style={styles.taskActions}>
              <TouchableOpacity onPress={() => handleToggleCompleted(item.id, item.completed)}>
                <Text style={[styles.status, item.completed ? styles.completed : styles.incomplete]}>
                  {item.completed ? '✓ Completed' : '⨯ Incomplete'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }} // Add padding at the bottom
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B6584',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#4B6584',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  picker: {
    flex: 1,
    marginRight: 10,
    height: 50,
    borderColor: '#4B6584',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: '#4B6584',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4B6584',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 25,
  },
  addButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  taskContainer: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  taskText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#777',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completed: {
    color: 'green',
  },
  incomplete: {
    color: 'red',
  },
  delete: {
    fontSize: 16,
    color: '#FF5252',
  },
});

export default App;
