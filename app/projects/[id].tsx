import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProjectStatusBadge } from '@/components/ui/StatusBadge';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  Users, 
  Activity, 
  CheckSquare, 
  Clock, 
  Edit, 
  Plus,
  ArrowRight
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useProjectsStore } from '@/store/projectsStore';
import { useTasksStore } from '@/store/tasksStore';
import { users } from '@/mocks/users';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { getProjectById } = useProjectsStore();
  const { tasks, fetchProjectTasks } = useTasksStore();

  const [project, setProject] = useState(getProjectById(id as string));

  useEffect(() => {
    if (id) {
      fetchProjectTasks(id as string);
    }
  }, [id]);

  if (!project) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Проект не найден
        </Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'completed');
  const inProgressTasks = projectTasks.filter(task => task.status === 'in_progress');
  const todoTasks = projectTasks.filter(task => task.status === 'todo');

  const teamMembers = project.teamMembers.map(memberId => 
    users.find(user => user.id === memberId)
  ).filter(Boolean);

  const manager = users.find(user => user.id === project.managerId);

  const handleCreateTask = () => {
    router.push(`/tasks/create?projectId=${project.id}`);
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {project.name}
          </Text>
          <ProjectStatusBadge status={project.status} />
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {project.description}
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>
              Прогресс проекта
            </Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>
              {project.progress}%
            </Text>
          </View>
          <ProgressBar progress={project.progress} height={8} />
        </View>

        <View style={styles.infoCards}>
          <Card variant="elevated" style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Calendar size={24} color={colors.primary} />
              <Text style={[styles.infoCardTitle, { color: colors.text }]}>
                Сроки
              </Text>
              <Text style={[styles.infoCardValue, { color: colors.textSecondary }]}>
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </Text>
            </View>
          </Card>

          <Card variant="elevated" style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <CheckSquare size={24} color={colors.success} />
              <Text style={[styles.infoCardTitle, { color: colors.text }]}>
                Задачи
              </Text>
              <Text style={[styles.infoCardValue, { color: colors.textSecondary }]}>
                {completedTasks.length}/{projectTasks.length} выполнено
              </Text>
            </View>
          </Card>

          <Card variant="elevated" style={styles.infoCard}>
            <TouchableOpacity 
              style={styles.infoCardContent}
              onPress={() => router.push(`/pulse/${project.id}`)}
            >
              <Activity size={24} color={colors.warning} />
              <Text style={[styles.infoCardTitle, { color: colors.text }]}>
                Пульс
              </Text>
              <Text style={[styles.infoCardValue, { color: colors.textSecondary }]}>
                Посмотреть
              </Text>
            </TouchableOpacity>
          </Card>
        </View>

        <Card variant="elevated" style={styles.teamCard}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Команда проекта
            </Text>
            <Text style={[styles.teamCount, { color: colors.textSecondary }]}>
              {project.teamMembers.length} участников
            </Text>
          </View>

          <View style={styles.managerSection}>
            <Text style={[styles.managerLabel, { color: colors.textSecondary }]}>
              Руководитель:
            </Text>
            <View style={styles.managerInfo}>
              <Avatar 
                source={manager?.avatar} 
                name={manager?.name} 
                size="small" 
              />
              <Text style={[styles.managerName, { color: colors.text }]}>
                {manager?.name}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.teamMembers}>
            {teamMembers.map((member, index) => (
              <View key={member?.id || index} style={styles.teamMember}>
                <Avatar 
                  source={member?.avatar} 
                  name={member?.name} 
                  size="small" 
                />
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.text }]}>
                    {member?.name}
                  </Text>
                  <Text style={[styles.memberRole, { color: colors.textSecondary }]}>
                    {member?.department}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Задачи проекта
            </Text>
            <TouchableOpacity onPress={() => console.log('View all tasks')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>
                Все задачи
              </Text>
            </TouchableOpacity>
          </View>

          {projectTasks.length === 0 ? (
            <Card variant="elevated" style={styles.emptyTasksCard}>
              <Text style={[styles.emptyTasksText, { color: colors.textSecondary }]}>
                В этом проекте пока нет задач
              </Text>
              <Button
                title="Создать задачу"
                onPress={handleCreateTask}
                variant="primary"
                size="small"
                style={styles.createTaskButton}
              />
            </Card>
          ) : (
            <>
              {projectTasks.slice(0, 3).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {projectTasks.length > 3 && (
                <TouchableOpacity 
                  style={styles.viewMoreButton}
                  onPress={() => console.log('View more tasks')}
                >
                  <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                    Показать еще {projectTasks.length - 3} задач
                  </Text>
                  <ArrowRight size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.fabContainer}>
        <Button
          title="Создать задачу"
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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
  },
  infoCardContent: {
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 12,
    textAlign: 'center',
  },
  teamCard: {
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
  teamCount: {
    fontSize: 14,
  },
  managerSection: {
    marginBottom: 16,
  },
  managerLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  managerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  managerName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  divider: {
    marginBottom: 16,
  },
  teamMembers: {
    gap: 12,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberInfo: {
    marginLeft: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 12,
  },
  tasksSection: {
    marginBottom: 80,
  },
  emptyTasksCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyTasksText: {
    fontSize: 14,
    marginBottom: 16,
  },
  createTaskButton: {
    minWidth: 150,
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
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});