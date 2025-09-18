import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme'; // 1. Import the hook

const FILTERS = ['All', 'Active', 'Completed'];

export default function FilterTabs({ activeFilter, onFilterChange }) {
  const { colors } = useTheme(); // 2. Use the hook
  const styles = getDynamicStyles(colors); // 3. Create dynamic styles

  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.tab,
            activeFilter === filter && styles.activeTab,
          ]}
          onPress={() => onFilterChange(filter)}
        >
          <Text
            style={[
              styles.tabText,
              activeFilter === filter && styles.activeTabText,
            ]}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// 4. Convert StyleSheet to a dynamic function
const getDynamicStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface, // Use surface color
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary, // Use theme primary color
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary, // Use theme text color
  },
  activeTabText: {
    color: '#FFFFFF', // Hardcode white for contrast on active tab
  },
});