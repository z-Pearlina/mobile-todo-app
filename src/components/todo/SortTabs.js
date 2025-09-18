import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const SortTabs = ({ activeSort, onSortChange }) => {
  const { colors } = useTheme();
  const styles = getDynamicStyles(colors);

  const sortOptions = [
    { key: 'createdAt', label: 'Created', icon: 'list-outline' },
    { key: 'dueDate', label: 'Due Date', icon: 'calendar-outline' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sort by:</Text>
      {sortOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[styles.tab, activeSort === option.key && styles.activeTab]}
          onPress={() => onSortChange(option.key)}
        >
          <Ionicons
            name={option.icon}
            size={18}
            color={activeSort === option.key ? colors.primary : colors.textSecondary}
            style={styles.icon}
          />
          <Text style={[styles.tabText, activeSort === option.key && styles.activeTabText]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getDynamicStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'flex-start',
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
    marginRight: 5,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  activeTab: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  icon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SortTabs;