import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/ui/Button';
import { 
  BarChart, 
  CheckSquare, 
  Clock, 
  Plus, 
  ArrowRight,
  Activity
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useProjectsStore } from '@/store/projectsStore';
import { useTasksStore } from '@/store/tasksStore';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { user } = useAuthStore();
  const { projects, fetchProjects } = useProjectsStore();
  const { tasks, fetchTasks } = useTasksStore();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // Get active projects (not completed or archived)
  const activeProjects = projects.filter(
    project => project.status !== 'completed' && project.status !== 'archived'
  );

  // Get tasks assigned to the current user
  const userTasks = tasks.filter(task => task.assigneeId === user?.id);
  
  // Get urgent tasks (high priority or urgent)
  const urgentTasks = userTasks.filter(
    task => (task.priority === 'high' || task.priority === 'urgent') && task.status !== 'completed'
  );
  
  // Get tasks due soon (in the next 3 days)
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);
  
  const tasksDueSoon = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate <= threeDaysLater && dueDate >= today && task.status !== 'completed';
  });

  // Calculate task completion stats
  const completedTasks = userTasks.filter(task => task.status === 'completed');
  const completionRate = userTasks.length > 0 
    ? Math.round((completedTasks.length / userTasks.length) * 100) 
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Добрый день,
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'Пользователь'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Avatar 
              source={user?.avatar} 
              name={user?.name} 
              size="medium" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCards}>
          <Card variant="elevated" style={styles.statsCard}>
            <View style={styles.statsIconContainer}>
              <View style={[styles.statsIconBackground, { backgroundColor: colors.primaryLight }]}>
                <CheckSquare size={20} color={colors.primary} />
              </View>
            </View>
            <Text style={[styles.statsValue, { color: colors.text }]}>
              {userTasks.length}
            </Text>
            <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
              Всего задач
            </Text>
          </Card>

          <Card variant="elevated" style={styles.statsCard}>
            <View style={styles.statsIconContainer}>
              <View style={[styles.statsIconBackground, { backgroundColor: colors.successLight }]}>
                <Activity size={20} color={colors.success} />
              </View>
            </View>
            <Text style={[styles.statsValue, { color: colors.text }]}>
              {completionRate}%
            </Text>
            <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
              Выполнено
            </Text>
          </Card>

          <Card variant="elevated" style={styles.statsCard}>
            <View style={styles.statsIconContainer}>
              <View style={[styles.statsIconBackground, { backgroundColor: colors.warningLight }]}>
                <Clock size={20} color={colors.warning} />
              </View>
            </View>
            <Text style={[styles.statsValue, { color: colors.text }]}>
              {tasksDueSoon.length}
            </Text>
            <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
              Скоро дедлайн
            </Text>
          </Card>
        </View>

        {urgentTasks.length > 0 && (
          <View style={styles.urgentSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Требуют внимания
              </Text>
            </View>
            {urgentTasks.slice(0, 2).map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            {urgentTasks.length > 2 && (
              <TouchableOpacity 
                style={styles.viewMoreButton}
                onPress={() => router.push('/tasks')}
              >
                <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                  Показать еще {urgentTasks.length - 2} задач
                </Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.projectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Активные проекты
            </Text>
            <TouchableOpacity onPress={() => router.push('/projects')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>
                Все проекты
              </Text>
            </TouchableOpacity>
          </View>

          {activeProjects.length === 0 ? (
            <Card variant="elevated" style={styles.emptyStateCard}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                У вас пока нет активных проектов
              </Text>
              <Button
                title="Создать проект"
                onPress={() => router.push('/projects/create')}
                variant="primary"
                size="small"
                style={styles.createButton}
              />
            </Card>
          ) : (
            <>
              {activeProjects.slice(0, 2).map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {activeProjects.length > 2 && (
                <TouchableOpacity 
                  style={styles.viewMoreButton}
                  onPress={() => router.push('/projects')}
                >
                  <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                    Показать еще {activeProjects.length - 2} проектов
                  </Text>
                  <ArrowRight size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Мои задачи
            </Text>
            <TouchableOpacity onPress={() => router.push('/tasks')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>
                Все задачи
              </Text>
            </TouchableOpacity>
          </View>

          {userTasks.length === 0 ? (
            <Card variant="elevated" style={styles.emptyStateCard}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                У вас пока нет назначенных задач
              </Text>
              <Button
                title="Создать задачу"
                onPress={() => router.push('/tasks/create')}
                variant="primary"
                size="small"
                style={styles.createButton}
              />
            </Card>
          ) : (
            <>
              {userTasks
                .filter(task => task.status !== 'completed')
                .slice(0, 3)
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              {userTasks.filter(task => task.status !== 'completed').length > 3 && (
                <TouchableOpacity 
                  style={styles.viewMoreButton}
                  onPress={() => router.push('/tasks')}
                >
                  <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                    Показать еще {userTasks.filter(task => task.status !== 'completed').length - 3} задач
                  </Text>
                  <ArrowRight size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={styles.quickActions}>
          <Button
            title="Новый проект"
            onPress={() => router.push('/projects/create')}
            leftIcon={<BarChart size={20} color="#FFFFFF" />}
            style={[styles.actionButton, { marginRight: 8 }]}
          />
          <Button
            title="Новая задача"
            onPress={() => router.push('/tasks/create')}
            leftIcon={<Plus size={20} color="#FFFFFF" />}
            style={[styles.actionButton, { marginLeft: 8 }]}
          />
        </View>
      </ScrollView>
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
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    alignItems: 'center',
  },
  statsIconContainer: {
    marginBottom: 8,
  },
  statsIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  urgentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  projectsSection: {
    marginBottom: 24,
  },
  tasksSection: {
    marginBottom: 24,
  },
  emptyStateCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    minWidth: 150,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
});