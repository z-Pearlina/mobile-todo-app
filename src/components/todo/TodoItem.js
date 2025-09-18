import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Link } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;
const ITEM_HEIGHT = 75;

export default function TodoItem({ item, onToggle, onDelete }) {
  const { colors } = useTheme();
  const styles = getDynamicStyles(colors);

  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  const marginBottom = useSharedValue(10);
  const opacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Allow swiping only to the left
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd(() => {
      const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD;
      if (shouldBeDismissed) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        itemHeight.value = withTiming(0);
        marginBottom.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished) {
            runOnJS(onDelete)();
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginBottom: marginBottom.value,
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.outerContainer, animatedContainerStyle]}>
      <View style={styles.deleteIconContainer}>
        <Ionicons name="trash-outline" size={24} color="white" />
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Link href={`/task/${item.id}`} asChild>
            <TouchableOpacity activeOpacity={0.7} style={styles.linkContent}>
              <TouchableOpacity onPress={onToggle} style={styles.checkboxContainer}>
                <Ionicons
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={28}
                  color={item.completed ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
              <Text
                style={[styles.text, item.completed && styles.completedText]}
                numberOfLines={1}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const getDynamicStyles = (colors) =>
  StyleSheet.create({
    outerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteIconContainer: {
      backgroundColor: '#ef4444', // A nice red color
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '30%',
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.lightGray,
      width: '100%',
      height: ITEM_HEIGHT,
    },
    linkContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxContainer: {
      marginRight: 15,
    },
    text: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },
  });