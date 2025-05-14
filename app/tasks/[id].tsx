import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/ui/StatusBadge';
import { PulseIndicator } from '@/components/ui/PulseIndicator';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { AddCommentForm } from '@/components/tasks/AddCommentForm';
import { 
  Calendar, 
  Clock, 
  Edit, 
  MessageSquare, 
  CheckSquare,
  Square,
  User,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useTasksStore } from '@/store/tasksStore';
import { useProjectsStore } from '@/store/projectsStore';
import { users } from '@/mocks/users';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { getTaskById, updateSubtask, updateTask } = useTasksStore();
  const { getProjectById } = useProjectsStore();

  const [task, setTask] = useState(getTaskById(id as string));
  const [project, setProject] = useState(task ? getProjectById(task.projectId) : undefined);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    if (task) {
      setProject(getProjectById(task.projectId));
    }
  }, [task]);

  useEffect(() => {
    // Refresh task data when the screen is focused
    const refreshTask = () => {
      const updatedTask = getTaskById(id as string);
      if (updatedTask) {
        setTask(updatedTask);
      }
    };

    refreshTask();
  }, [id]);

  if (!task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Задача не найдена
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

  const getDaysRemaining = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isOverdue = daysRemaining < 0;

  const assignee = users.find(user => user.id === task.assigneeId);
  const creator = users.find(user => user.id === task.creatorId);

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    await updateSubtask(task.id, subtaskId, completed);
    // Update local state
    setTask({
      ...task,
      subtasks: task.subtasks?.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, completed } 
          : subtask
      )
    });
  };

  const handleChangeStatus = async (status: 'todo' | 'in_progress' | 'review' | 'completed') => {
    await updateTask(task.id, { status });
    // Update local state
    setTask({
      ...task,
      status
    });
  };

  const handleCommentAdded = () => {
    // Refresh task data to show the new comment
    const updatedTask = getTaskById(id as string);
    if (updatedTask) {
      setTask(updatedTask);
    }
    setShowCommentForm(false);
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.badges}>
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </View>
          {task.pulseScore !== undefined && (
            <PulseIndicator score={task.pulseScore} size="small" showLabel={true} />
          )}
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {task.title}
        </Text>

        <TouchableOpacity 
          style={styles.projectLink}
          onPress={() => router.push(`/projects/${task.projectId}`)}
        >
          <Text style={[styles.projectLabel, { color: colors.textSecondary }]}>
            Проект:
          </Text>
          <Text style={[styles.projectName, { color: colors.primary }]}>
            {project?.name || 'Загрузка...'}
          </Text>
        </TouchableOpacity>

        <Card variant="elevated" style={styles.statusCard}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>
            Статус задачи
          </Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'todo' && { backgroundColor: colors.info + '20', borderColor: colors.info },
              ]}
              onPress={() => handleChangeStatus('todo')}
            >
              <Text style={[styles.statusButtonText, task.status === 'todo' && { color: colors.info }]}>
                К выполнению
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'in_progress' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
              ]}
              onPress={() => handleChangeStatus('in_progress')}
            >
              <Text style={[styles.statusButtonText, task.status === 'in_progress' && { color: colors.primary }]}>
                В работе
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'review' && { backgroundColor: colors.warning + '20', borderColor: colors.warning },
              ]}
              onPress={() => handleChangeStatus('review')}
            >
              <Text style={[styles.statusButtonText, task.status === 'review' && { color: colors.warning }]}>
                На проверке
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'completed' && { backgroundColor: colors.success + '20', borderColor: colors.success },
              ]}
              onPress={() => handleChangeStatus('completed')}
            >
              <Text style={[styles.statusButtonText, task.status === 'completed' && { color: colors.success }]}>
                Выполнено
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card variant="elevated" style={styles.descriptionCard}>
          <Text style={[styles.descriptionTitle, { color: colors.text }]}>
            Описание
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {task.description}
          </Text>
        </Card>

        <View style={styles.infoCards}>
          <Card variant="elevated" style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Calendar size={24} color={isOverdue ? colors.error : colors.primary} />
              <Text style={[styles.infoCardTitle, { color: colors.text }]}>
                Срок
              </Text>
              <Text 
                style={[
                  styles.infoCardValue, 
                  { color: isOverdue ? colors.error : colors.textSecondary }
                ]}
              >
                {formatDate(task.dueDate)}
              </Text>
              {daysRemaining !== 0 && (
                <Text 
                  style={[
                    styles.daysRemaining, 
                    { color: isOverdue ? colors.error : colors.textSecondary }
                  ]}
                >
                  {isOverdue ? 'Просрочено на ' : 'Осталось '}{Math.abs(daysRemaining)} {getDaysWord(Math.abs(daysRemaining))}
                </Text>
              )}
            </View>
          </Card>

          <Card variant="elevated" style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <Clock size={24} color={colors.info} />
              <Text style={[styles.infoCardTitle, { color: colors.text }]}>
                Время
              </Text>
              <Text style={[styles.infoCardValue, { color: colors.textSecondary }]}>
                {task.estimatedHours ? `${task.estimatedHours} ч.` : 'Не указано'}
              </Text>
              {task.actualHours && (
                <Text style={[styles.actualHours, { color: colors.textSecondary }]}>
                  Затрачено: {task.actualHours} ч.
                </Text>
              )}
            </View>
          </Card>
        </View>

        <Card variant="elevated" style={styles.peopleCard}>
          <View style={styles.personSection}>
            <Text style={[styles.personLabel, { color: colors.textSecondary }]}>
              Исполнитель:
            </Text>
            <View style={styles.personInfo}>
              <Avatar 
                source={assignee?.avatar} 
                name={assignee?.name} 
                size="small" 
              />
              <Text style={[styles.personName, { color: colors.text }]}>
                {assignee?.name || 'Не назначен'}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.personSection}>
            <Text style={[styles.personLabel, { color: colors.textSecondary }]}>
              Создатель:
            </Text>
            <View style={styles.personInfo}>
              <Avatar 
                source={creator?.avatar} 
                name={creator?.name} 
                size="small" 
              />
              <Text style={[styles.personName, { color: colors.text }]}>
                {creator?.name || 'Неизвестно'}
              </Text>
            </View>
          </View>
        </Card>

        {task.subtasks && task.subtasks.length > 0 && (
          <Card variant="elevated" style={styles.subtasksCard}>
            <Text style={[styles.subtasksTitle, { color: colors.text }]}>
              Подзадачи ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
            </Text>
            
            <View style={styles.subtasksList}>
              {task.subtasks.map(subtask => {
                const subtaskAssignee = subtask.assigneeId 
                  ? users.find(user => user.id === subtask.assigneeId)
                  : undefined;
                
                return (
                  <TouchableOpacity 
                    key={subtask.id} 
                    style={styles.subtaskItem}
                    onPress={() => handleToggleSubtask(subtask.id, !subtask.completed)}
                  >
                    <View style={styles.subtaskCheckbox}>
                      {subtask.completed ? (
                        <CheckSquare size={20} color={colors.primary} />
                      ) : (
                        <Square size={20} color={colors.textSecondary} />
                      )}
                    </View>
                    <View style={styles.subtaskContent}>
                      <Text 
                        style={[
                          styles.subtaskTitle, 
                          { 
                            color: colors.text,
                            textDecorationLine: subtask.completed ? 'line-through' : 'none',
                            opacity: subtask.completed ? 0.7 : 1,
                          }
                        ]}
                      >
                        {subtask.title}
                      </Text>
                      {subtaskAssignee && (
                        <View style={styles.subtaskAssignee}>
                          <User size={12} color={colors.textSecondary} />
                          <Text style={[styles.subtaskAssigneeName, { color: colors.textSecondary }]}>
                            {subtaskAssignee.name}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        )}

        <Card variant="elevated" style={styles.commentsCard}>
          <View style={styles.commentsHeader}>
            <Text style={[styles.commentsTitle, { color: colors.text }]}>
              Комментарии ({task.comments?.length || 0})
            </Text>
            <TouchableOpacity 
              style={styles.addCommentButton}
              onPress={() => setShowCommentForm(!showCommentForm)}
            >
              {showCommentForm ? (
                <ChevronUp size={20} color={colors.primary} />
              ) : (
                <ChevronDown size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
          
          {showCommentForm && (
            <AddCommentForm taskId={task.id} onCommentAdded={handleCommentAdded} />
          )}
          
          {task.comments && task.comments.length > 0 ? (
            <View style={styles.commentsList}>
              {task.comments.map(comment => {
                const commentUser = users.find(user => user.id === comment.userId);
                
                return (
                  <View key={comment.id} style={styles.commentItem}>
                    <Avatar 
                      source={commentUser?.avatar} 
                      name={commentUser?.name} 
                      size="small" 
                    />
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={[styles.commentAuthor, { color: colors.text }]}>
                          {commentUser?.name || 'Неизвестный пользователь'}
                        </Text>
                        <Text style={[styles.commentDate, { color: colors.textSecondary }]}>
                          {formatDate(comment.createdAt)}
                        </Text>
                      </View>
                      <Text style={[styles.commentText, { color: colors.textSecondary }]}>
                        {comment.text}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={[styles.noCommentsText, { color: colors.textSecondary }]}>
              Нет комментариев. Будьте первым, кто оставит комментарий!
            </Text>
          )}
          
          {!showCommentForm && (
            <Button
              title="Добавить комментарий"
              onPress={() => setShowCommentForm(true)}
              variant="outline"
              leftIcon={<MessageSquare size={20} color={colors.primary} />}
              style={styles.commentButton}
            />
          )}
        </Card>
      </ScrollView>

      <View style={styles.fabContainer}>
        <Button
          title="Редактировать"
          onPress={() => router.push(`/tasks/edit/${task.id}`)}
          leftIcon={<Edit size={20} color="#FFFFFF" />}
          style={styles.fab}
        />
      </View>
    </SafeAreaView>
  );
}

// Helper function to get the correct word form for days in Russian
const getDaysWord = (days: number): string => {
  if (days % 10 === 1 && days % 100 !== 11) {
    return 'день';
  } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
    return 'дня';
  } else {
    return 'дней';
  }
};

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
  badges: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  projectLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusCard: {
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionCard: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  daysRemaining: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  actualHours: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  peopleCard: {
    marginBottom: 16,
  },
  personSection: {
    paddingVertical: 12,
  },
  personLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  divider: {
    marginVertical: 4,
  },
  subtasksCard: {
    marginBottom: 16,
  },
  subtasksTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtasksList: {
    gap: 12,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subtaskCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  subtaskContent: {
    flex: 1,
  },
  subtaskTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  subtaskAssignee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtaskAssigneeName: {
    fontSize: 12,
  },
  commentsCard: {
    marginBottom: 80,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  addCommentButton: {
    padding: 4,
  },
  commentsList: {
    gap: 16,
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noCommentsText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  commentButton: {
    alignSelf: 'flex-start',
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