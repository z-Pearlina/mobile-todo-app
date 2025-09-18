import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  LayoutAnimation, 
  UIManager,      
} from 'react-native';
import { useTheme } from '../../src/hooks/useTheme'; 
import { useAuth } from '../../src/hooks/useAuth';
import { getTodos, addTodo, toggleTodo, deleteTodo } from '../../src/services/firebase';

// Import components
import TodoItem from '../../src/components/todo/TodoItem';
import FilterTabs from '../../src/components/todo/FilterTabs';
import SortTabs from '../../src/components/todo/SortTabs';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// ENABLE LAYOUT ANIMATIONS FOR ANDROID
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  // State for the new task
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State for the list
  const [todos, setTodos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('createdAt');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setTodos([]);
      return;
    }
    const unsubscribe = getTodos(user.uid, (todosData) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTodos(todosData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const processedTodos = useMemo(() => {
    let filtered;
    if (activeFilter === 'Active') {
      filtered = todos.filter(todo => !todo.completed);
    } else if (activeFilter === 'Completed') {
      filtered = todos.filter(todo => todo.completed);
    } else {
      filtered = todos;
    }

    return [...filtered].sort((a, b) => {
      if (activeSort === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [todos, activeFilter, activeSort]);

  const handleAddTask = async () => {
    if (task.trim().length === 0) {
      Alert.alert("Invalid Task", "Task cannot be empty.");
      return;
    }
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      if (dueDate < today) {
        Alert.alert("Invalid Date", "Due date cannot be in the past.");
        return;
      }
    }
    if (!user) return;

    try {
      await addTodo(user.uid, task.trim(), dueDate);
      setTask('');
      setDueDate(null);
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert("Error", "Could not add your task.");
    }
  };
  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleToggleTodo = (id, currentStatus) => {
     if (!user) return;
     // Correct function call
     toggleTodo(user.uid, id, currentStatus);
  };
  
  const handleDeleteTodo = (id) => {
     if (!user) return;
     // Correct function call
     deleteTodo(user.uid, id);
  };

  const styles = getDynamicStyles(colors);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>My To-Do List</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor={colors.textSecondary}
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={28} color={dueDate ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {dueDate && (
          <View style={styles.dueDateBadge}>
            <Text style={styles.dueDateText}>Due: {dueDate.toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => setDueDate(null)}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.controlsContainer}>
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </View>
        <SortTabs activeSort={activeSort} onSortChange={setActiveSort} />

        <FlatList
          data={processedTodos}
          renderItem={({ item }) => (
            <TodoItem
              item={item}
              onToggle={() => handleToggleTodo(item.id, item.completed)}
              onDelete={() => handleDeleteTodo(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyListText}>No tasks yet. Add one!</Text>}
        />

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const getDynamicStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60, paddingHorizontal: 20 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  iconButton: { padding: 10 },
  addButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 10,
    gap: 8,
    alignItems: 'center'
  },
  dueDateText: { color: colors.textSecondary },
  controlsContainer: {
    marginBottom: 10,
  },
  list: { flex: 1 },
  emptyListText: { textAlign: 'center', color: colors.textSecondary, marginTop: 50, fontSize: 16 },
});