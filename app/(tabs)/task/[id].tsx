import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '../../../src/hooks/useTheme';
import { useAuth } from '../../../src/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTodoById, updateTodoDetails } from '../../../src/services/firebase';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // State for editable fields
  const [editedText, setEditedText] = useState('');
  const [editedDate, setEditedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const taskId = Array.isArray(id) ? id[0] : id;
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const taskData = await getTodoById(taskId);
        if (taskData) {
          setTask(taskData);
          setEditedText(taskData.text);
          setEditedDate(taskData.dueDate || null);
        } else {
          Alert.alert("Not Found", "This task could not be found.", [{ text: "OK", onPress: () => router.back() }]);
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        Alert.alert("Error", "There was an error fetching the task.", [{ text: "OK", onPress: () => router.back() }]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSave = async () => {
    if (editedText.trim().length === 0) {
      Alert.alert("Invalid Task", "Task text cannot be empty.");
      return;
    }

    if (editedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (editedDate < today) {
        Alert.alert("Invalid Date", "Due date cannot be in the past.");
        return;
      }
    }

    try {
      if (!user) {
        Alert.alert("Authentication Error", "You are not logged in.");
        return;
      }
      const taskId = Array.isArray(id) ? id[0] : id;
      const detailsToUpdate = { text: editedText.trim(), dueDate: editedDate };
      await updateTodoDetails(user.uid, taskId, detailsToUpdate);

      setTask({ ...task, ...detailsToUpdate });
      setIsEditing(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert("Error", "Failed to save the task.");
    }
  };

  const handleCancel = () => {
    setEditedText(task.text);
    setEditedDate(task.dueDate || null);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || editedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setEditedDate(currentDate);
  };

  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return 'Not set';
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
        <Stack.Screen options={{ headerShown: false }} />

        {/* --- Custom Header --- */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Task Details</Text>
            <View style={{ width: 40 }} /> 
        </View>
        
        <View style={styles.content}>
          <View style={styles.taskHeaderContainer}>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={editedText}
                onChangeText={setEditedText}
                autoFocus={true}
                multiline={true}
              />
            ) : (
              <Text style={styles.taskText}>{task?.text}</Text>
            )}
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                  <Ionicons name="create-outline" size={26} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          {isEditing && (
              <View style={styles.editControls}>
                  <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
                      <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
                      <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Save</Text>
                  </TouchableOpacity>
              </View>
          )}
          
          <View style={styles.divider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Status:</Text>
            <Text style={styles.metaValue}>{task?.completed ? 'Completed' : 'Active'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Created:</Text>
            <Text style={styles.metaValue}>{formatDate(task?.createdAt)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Due Date:</Text>
            {isEditing ? (
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.metaValue, { color: colors.primary }]}>{formatDate(editedDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            ) : (
              <Text style={styles.metaValue}>{formatDate(task?.dueDate)}</Text>
            )}
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={editedDate || new Date()}
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
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    // FIX: Increased top padding to lower the header from the status bar
    paddingTop: 40,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  taskHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  taskText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 32,
    flex: 1,
    marginRight: 15,
  },
  textInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 32,
    flex: 1,
    marginRight: 15,
    paddingTop: 0,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  editButton: {
    padding: 5,
  },
  editControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  divider: { height: 1, backgroundColor: colors.lightGray, marginVertical: 15 },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 24,
  },
  metaLabel: { fontSize: 16, color: colors.textSecondary, fontWeight: '600' },
  metaValue: { fontSize: 16, color: colors.text },
  datePickerButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
});
