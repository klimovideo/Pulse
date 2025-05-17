import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import {
  Calendar,
  Filter,
  ChevronDown,
  Clock,
  AlertTriangle,
  User,
  X,
} from 'lucide-react-native';

export type TaskPriority = 'all' | 'low' | 'medium' | 'high' | 'urgent';
export type TaskSortOption = 'newest' | 'oldest' | 'priority' | 'dueDate';
export type TaskAssigneeFilter = 'all' | 'me' | 'unassigned';

interface TaskFilterOptions {
  priority: TaskPriority;
  sort: TaskSortOption;
  assignee: TaskAssigneeFilter;
  dueSoon: boolean;
}

interface TaskFilterSheetProps {
  filterOptions: TaskFilterOptions;
  onFilterChange: (options: TaskFilterOptions) => void;
  onResetFilters: () => void;
}

export const TaskFilterSheet: React.FC<TaskFilterSheetProps> = ({
  filterOptions,
  onFilterChange,
  onResetFilters,
}) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { showActionSheetWithOptions } = useActionSheet();
  const [options, setOptions] = useState<TaskFilterOptions>(filterOptions);

  useEffect(() => {
    setOptions(filterOptions);
  }, [filterOptions]);

  const handleSortPress = () => {
    const sortOptions = ['Newest First', 'Oldest First', 'By Priority', 'By Due Date', 'Cancel'];
    const sortValues: TaskSortOption[] = ['newest', 'oldest', 'priority', 'dueDate'];
    const cancelButtonIndex = 4;

    showActionSheetWithOptions(
      {
        options: sortOptions,
        cancelButtonIndex,
        title: 'Sort Tasks By',
        containerStyle: {
          backgroundColor: colors.card,
        },
        textStyle: {
          color: colors.text,
        },
        titleTextStyle: {
          color: colors.text,
        },
      },
      (selectedIndex) => {
        if (selectedIndex !== undefined && selectedIndex !== cancelButtonIndex) {
          const newOptions = { ...options, sort: sortValues[selectedIndex] };
          setOptions(newOptions);
          onFilterChange(newOptions);
        }
      }
    );
  };

  const handlePriorityPress = () => {
    const priorityOptions = ['All Priorities', 'Low', 'Medium', 'High', 'Urgent', 'Cancel'];
    const priorityValues: TaskPriority[] = ['all', 'low', 'medium', 'high', 'urgent'];
    const cancelButtonIndex = 5;

    showActionSheetWithOptions(
      {
        options: priorityOptions,
        cancelButtonIndex,
        title: 'Filter by Priority',
        containerStyle: {
          backgroundColor: colors.card,
        },
        textStyle: {
          color: colors.text,
        },
        titleTextStyle: {
          color: colors.text,
        },
      },
      (selectedIndex) => {
        if (selectedIndex !== undefined && selectedIndex !== cancelButtonIndex) {
          const newOptions = { ...options, priority: priorityValues[selectedIndex] };
          setOptions(newOptions);
          onFilterChange(newOptions);
        }
      }
    );
  };

  const handleAssigneePress = () => {
    const assigneeOptions = ['All Tasks', 'Assigned to Me', 'Unassigned', 'Cancel'];
    const assigneeValues: TaskAssigneeFilter[] = ['all', 'me', 'unassigned'];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options: assigneeOptions,
        cancelButtonIndex,
        title: 'Filter by Assignee',
        containerStyle: {
          backgroundColor: colors.card,
        },
        textStyle: {
          color: colors.text,
        },
        titleTextStyle: {
          color: colors.text,
        },
      },
      (selectedIndex) => {
        if (selectedIndex !== undefined && selectedIndex !== cancelButtonIndex) {
          const newOptions = { ...options, assignee: assigneeValues[selectedIndex] };
          setOptions(newOptions);
          onFilterChange(newOptions);
        }
      }
    );
  };

  const handleDueSoonToggle = () => {
    const newOptions = { ...options, dueSoon: !options.dueSoon };
    setOptions(newOptions);
    onFilterChange(newOptions);
  };

  const getSortText = () => {
    switch (options.sort) {
      case 'newest':
        return 'Newest First';
      case 'oldest':
        return 'Oldest First';
      case 'priority':
        return 'By Priority';
      case 'dueDate':
        return 'By Due Date';
    }
  };

  const getPriorityText = () => {
    switch (options.priority) {
      case 'all':
        return 'All Priorities';
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      case 'urgent':
        return 'Urgent';
    }
  };

  const getAssigneeText = () => {
    switch (options.assignee) {
      case 'all':
        return 'All Tasks';
      case 'me':
        return 'Assigned to Me';
      case 'unassigned':
        return 'Unassigned';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Filter size={20} color={colors.text} />
          <Text style={[styles.title, { color: colors.text }]}>Filter Tasks</Text>
        </View>
        <TouchableOpacity onPress={onResetFilters}>
          <X size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Sort By
        </Text>
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: colors.card }]}
          onPress={handleSortPress}
        >
          <View style={styles.optionLeft}>
            <Clock size={20} color={colors.secondary} />
            <Text style={[styles.optionText, { color: colors.text }]}>
              {getSortText()}
            </Text>
          </View>
          <ChevronDown size={18} color={colors.secondary} />
        </TouchableOpacity>

        <Divider style={styles.divider} />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Filter By
        </Text>

        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: colors.card }]}
          onPress={handlePriorityPress}
        >
          <View style={styles.optionLeft}>
            <AlertTriangle size={20} color={colors.secondary} />
            <Text style={[styles.optionText, { color: colors.text }]}>
              {getPriorityText()}
            </Text>
          </View>
          <ChevronDown size={18} color={colors.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: colors.card }]}
          onPress={handleAssigneePress}
        >
          <View style={styles.optionLeft}>
            <User size={20} color={colors.secondary} />
            <Text style={[styles.optionText, { color: colors.text }]}>
              {getAssigneeText()}
            </Text>
          </View>
          <ChevronDown size={18} color={colors.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            { backgroundColor: colors.card },
          ]}
          onPress={handleDueSoonToggle}
        >
          <View style={styles.optionLeft}>
            <Calendar size={20} color={colors.secondary} />
            <Text style={[styles.optionText, { color: colors.text }]}>
              Due Soon
            </Text>
          </View>
          <View
            style={[
              styles.toggleButton,
              {
                backgroundColor: options.dueSoon
                  ? colors.primary
                  : theme === 'light'
                  ? '#E2E8F0'
                  : '#2D3748',
              },
            ]}
          >
            <View
              style={[
                styles.toggleCircle,
                {
                  backgroundColor: '#FFFFFF',
                  transform: [
                    { translateX: options.dueSoon ? 16 : 1 },
                  ],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Apply Filters"
          onPress={() => onFilterChange(options)}
          variant="primary"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    marginVertical: 16,
  },
  toggleButton: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
}); 