import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  Plus, 
  Search, 
  Filter, 
  X,
  CheckSquare,
  AlertTriangle
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useTasksStore } from '@/store/tasksStore';
import { useProjectsStore } from '@/store/projectsStore';
import { useAuthStore } from '@/store/authStore';
import { Task } from '@/types';

export default function TasksScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { tasks, fetchTasks, filterTasks } = useTasksStore();
  const { projects, fetchProjects } = useProjectsStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Task['status'] | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<Task['priority'] | undefined>(undefined);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const handleCreateTask = () => {
    router.push('/tasks/create');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus(undefined);
    setSelectedPriority(undefined);
    setSelectedProjectId(undefined);
  };

  const filteredTasks = filterTasks(
    selectedProjectId,
    selectedStatus,
    selectedPriority,
    showMyTasksOnly ? user?.id : undefined,
    searchQuery
  );

  const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'archived');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Задачи
        </Text>
        <Button
          title="Создать"
          onPress={handleCreateTask}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
          size="small"
        />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={20} color={colors.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Поиск задач..."
            placeholderTextColor={colors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={colors.secondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: showFilters ? colors.primaryLight : colors.card }
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? colors.primary : colors.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            showMyTasksOnly && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
          ]}
          onPress={() => setShowMyTasksOnly(true)}
        >
          <Text 
            style={[
              styles.toggleButtonText, 
              showMyTasksOnly && { color: colors.primary },
            ]}
          >
            Мои задачи
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !showMyTasksOnly && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
          ]}
          onPress={() => setShowMyTasksOnly(false)}
        >
          <Text 
            style={[
              styles.toggleButtonText, 
              !showMyTasksOnly && { color: colors.primary },
            ]}
          >
            Все задачи
          </Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>
            Статус задачи:
          </Text>
          <View style={styles.statusFilters}>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === undefined && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedStatus(undefined)}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === undefined && { color: colors.primary },
                ]}
              >
                Все
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'todo' && { backgroundColor: colors.infoLight, borderColor: colors.info },
              ]}
              onPress={() => setSelectedStatus('todo')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'todo' && { color: colors.info },
                ]}
              >
                К выполнению
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'in_progress' && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedStatus('in_progress')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'in_progress' && { color: colors.primary },
                ]}
              >
                В работе
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'review' && { backgroundColor: colors.warningLight, borderColor: colors.warning },
              ]}
              onPress={() => setSelectedStatus('review')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'review' && { color: colors.warning },
                ]}
              >
                На проверке
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusFilter,
                selectedStatus === 'completed' && { backgroundColor: colors.successLight, borderColor: colors.success },
              ]}
              onPress={() => setSelectedStatus('completed')}
            >
              <Text 
                style={[
                  styles.statusFilterText, 
                  selectedStatus === 'completed' && { color: colors.success },
                ]}
              >
                Выполнено
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.filtersTitle, { color: colors.text, marginTop: 12 }]}>
            Приоритет:
          </Text>
          <View style={styles.priorityFilters}>
            <TouchableOpacity
              style={[
                styles.priorityFilter,
                selectedPriority === undefined && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedPriority(undefined)}
            >
              <Text 
                style={[
                  styles.priorityFilterText, 
                  selectedPriority === undefined && { color: colors.primary },
                ]}
              >
                Все
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityFilter,
                selectedPriority === 'low' && { backgroundColor: colors.infoLight, borderColor: colors.info },
              ]}
              onPress={() => setSelectedPriority('low')}
            >
              <Text 
                style={[
                  styles.priorityFilterText, 
                  selectedPriority === 'low' && { color: colors.info },
                ]}
              >
                Низкий
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityFilter,
                selectedPriority === 'medium' && { backgroundColor: colors.secondaryLight, borderColor: colors.secondary },
              ]}
              onPress={() => setSelectedPriority('medium')}
            >
              <Text 
                style={[
                  styles.priorityFilterText, 
                  selectedPriority === 'medium' && { color: colors.secondary },
                ]}
              >
                Средний
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityFilter,
                selectedPriority === 'high' && { backgroundColor: colors.warningLight, borderColor: colors.warning },
              ]}
              onPress={() => setSelectedPriority('high')}
            >
              <Text 
                style={[
                  styles.priorityFilterText, 
                  selectedPriority === 'high' && { color: colors.warning },
                ]}
              >
                Высокий
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityFilter,
                selectedPriority === 'urgent' && { backgroundColor: colors.errorLight, borderColor: colors.error },
              ]}
              onPress={() => setSelectedPriority('urgent')}
            >
              <Text 
                style={[
                  styles.priorityFilterText, 
                  selectedPriority === 'urgent' && { color: colors.error },
                ]}
              >
                Срочно
              </Text>
            </TouchableOpacity>
          </View>

          {activeProjects.length > 0 && (
            <>
              <Text style={[styles.filtersTitle, { color: colors.text, marginTop: 12 }]}>
                Проект:
              </Text>
              <View style={styles.projectFilters}>
                <TouchableOpacity
                  style={[
                    styles.projectFilter,
                    selectedProjectId === undefined && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                  ]}
                  onPress={() => setSelectedProjectId(undefined)}
                >
                  <Text 
                    style={[
                      styles.projectFilterText, 
                      selectedProjectId === undefined && { color: colors.primary },
                    ]}
                  >
                    Все проекты
                  </Text>
                </TouchableOpacity>
                {activeProjects.map(project => (
                  <TouchableOpacity
                    key={project.id}
                    style={[
                      styles.projectFilter,
                      selectedProjectId === project.id && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                    ]}
                    onPress={() => setSelectedProjectId(project.id)}
                  >
                    <Text 
                      style={[
                        styles.projectFilterText, 
                        selectedProjectId === project.id && { color: colors.primary },
                      ]}
                    >
                      {project.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {(searchQuery || selectedStatus || selectedPriority || selectedProjectId) && (
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
            >
              <Text style={[styles.clearFiltersText, { color: colors.primary }]}>
                Сбросить фильтры
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.tasksList}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <EmptyState
            icon={<CheckSquare size={48} color={colors.secondary} />}
            title="Задачи не найдены"
            description={
              searchQuery || selectedStatus || selectedPriority || selectedProjectId
                ? "Попробуйте изменить параметры поиска или фильтры"
                : showMyTasksOnly
                ? "У вас пока нет назначенных задач"
                : "В системе пока нет задач. Создайте первую задачу!"
            }
            actionButton={
              searchQuery || selectedStatus || selectedPriority || selectedProjectId ? (
                <Button
                  title="Сбросить фильтры"
                  onPress={handleClearFilters}
                  variant="outline"
                />
              ) : (
                <Button
                  title="Создать задачу"
                  onPress={handleCreateTask}
                  leftIcon={<Plus size={20} color="#FFFFFF" />}
                />
              )
            }
          />
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <Button
          title="Новая задача"
          onPress={handleCreateTask}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
          style={styles.fab}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFilter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  statusFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityFilter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  priorityFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectFilter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  projectFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tasksList: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    borderRadius: 28,
    paddingHorizontal: 20,
  },
});