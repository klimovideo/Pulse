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
  Activity,
  CalendarClock,
  Layers,
  LucideIcon
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useProjectsStore } from '@/store/projectsStore';
import { useTasksStore } from '@/store/tasksStore';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, value, label, color, bgColor }) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  
  return (
    <Card variant="elevated" style={styles.statsCard}>
      <View style={styles.statsIconContainer}>
        <View style={[styles.statsIconBackground, { backgroundColor: bgColor }]}>
          <Icon size={20} color={color} />
        </View>
      </View>
      <Text style={[styles.statsValue, { color: colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </Card>
  );
};

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

  // Helper for greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {getGreeting()},
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
          <StatsCard 
            icon={Layers}
            value={activeProjects.length}
            label="Активные проекты"
            color={colors.info}
            bgColor={colors.infoLight}
          />
          <StatsCard 
            icon={CheckSquare}
            value={userTasks.length}
            label="Всего задач"
            color={colors.primary}
            bgColor={colors.primaryLight}
          />
          <StatsCard 
            icon={Activity}
            value={`${completionRate}%`}
            label="Выполнено"
            color={colors.success}
            bgColor={colors.successLight}
          />
          <StatsCard 
            icon={CalendarClock}
            value={tasksDueSoon.length}
            label="Скоро дедлайн"
            color={colors.warning}
            bgColor={colors.warningLight}
          />
        </View>

        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Общий прогресс
          </Text>
          <Card variant="flat" style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                Задачи
              </Text>
              <Text style={[styles.progressStats, { color: colors.textSecondary }]}>
                {completedTasks.length} / {userTasks.length}
              </Text>
            </View>
            <ProgressBar 
              progress={completionRate / 100} 
              height={8}
              color={colors.primary}
              trackColor={theme === 'light' ? '#F1F5F9' : '#1E293B'}
            />
          </Card>
        </View>

        {urgentTasks.length > 0 && (
          <View style={styles.urgentSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.priorityIndicator, { backgroundColor: colors.error }]} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Приоритетные задачи
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/tasks')}>
                <Text style={[styles.viewAll, { color: colors.primary }]}>
                  Все задачи
                </Text>
              </TouchableOpacity>
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
                leftIcon={<Plus size={16} color="#FFFFFF" />}
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

        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Быстрые действия
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: theme === 'light' ? '#F1F5F9' : '#1E293B' }]} 
              onPress={() => router.push('/tasks/create')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                <CheckSquare size={20} color={colors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Новая задача
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: theme === 'light' ? '#F1F5F9' : '#1E293B' }]} 
              onPress={() => router.push('/projects/create')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.infoLight }]}>
                <BarChart size={20} color={colors.info} />
              </View>
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Новый проект
              </Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 16,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statsCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: '48%',
    marginBottom: 16,
    padding: 16,
  },
  statsIconContainer: {
    marginBottom: 12,
  },
  statsIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressCard: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressStats: {
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 8,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  urgentSection: {
    marginBottom: 24,
  },
  projectsSection: {
    marginBottom: 24,
  },
  emptyStateCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    minWidth: 180,
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
    marginRight: 8,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  quickActionButton: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});