import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, Clock, AlertTriangle, CheckSquare, Plus } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useTasksStore } from '@/store/tasksStore';
import { useProjectsStore } from '@/store/projectsStore';
import { useAuthStore } from '@/store/authStore';
import { users } from '@/mocks/users';
import { Platform } from 'react-native';
import { Task } from '@/types';

export default function CreateTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const projectId = params.projectId as string;
  
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { addTask, isLoading } = useTasksStore();
  const { projects, getProjectById } = useProjectsStore();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // +7 days
  const [estimatedHours, setEstimatedHours] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [subtasks, setSubtasks] = useState<{ title: string; completed: boolean }[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    project?: string;
    assignee?: string;
  }>({});

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { title: newSubtask, completed: false }]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    const newSubtasks = [...subtasks];
    newSubtasks.splice(index, 1);
    setSubtasks(newSubtasks);
  };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      project?: string;
      assignee?: string;
    } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Название задачи обязательно';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Описание задачи обязательно';
      isValid = false;
    }

    if (!selectedProject) {
      newErrors.project = 'Выберите проект';
      isValid = false;
    }

    if (!assigneeId) {
      newErrors.assignee = 'Выберите исполнителя';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) return;

    const newTask = {
      title,
      description,
      projectId: selectedProject,
      status: 'todo' as const,
      priority,
      assigneeId,
      creatorId: user?.id || '1',
      dueDate: dueDate.toISOString(),
      estimatedHours: estimatedHours ? parseInt(estimatedHours) : undefined,
      subtasks: subtasks.map((st, index) => ({
        taskId: '', // Will be set by the store
        id: `temp-${index}`,
        title: st.title,
        completed: st.completed,
      })),
    };

    try {
      await addTask(newTask);
      Alert.alert("Успех", "Задача успешно создана!");
      
      if (projectId) {
        router.push(`/projects/${projectId}`);
      } else {
        router.push('/tasks');
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось создать задачу. Попробуйте еще раз.");
    }
  };

  // Get team members for the selected project
  const getProjectTeamMembers = () => {
    if (!selectedProject) return [];
    
    const project = getProjectById(selectedProject);
    if (!project) return [];
    
    return users.filter(user => 
      project.teamMembers.includes(user.id) || user.id === project.managerId
    );
  };

  const teamMembers = getProjectTeamMembers();
  const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'archived');

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>
          Создание новой задачи
        </Text>

        <Card variant="elevated" style={styles.formCard}>
          <Input
            label="Название задачи"
            placeholder="Введите название задачи"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <View style={styles.textAreaContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Описание задачи
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  color: colors.text,
                  backgroundColor: theme === 'light' ? '#F9FAFB' : '#1F2937',
                  borderColor: errors.description ? colors.error : colors.border,
                },
              ]}
              placeholder="Введите описание задачи"
              placeholderTextColor={colors.secondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.description}
              </Text>
            )}
          </View>

          {!projectId && (
            <View style={styles.projectSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Проект
              </Text>
              <View style={styles.projectList}>
                {activeProjects.map(project => (
                  <TouchableOpacity
                    key={project.id}
                    style={[
                      styles.projectItem,
                      selectedProject === project.id && {
                        backgroundColor: colors.primaryLight + '20',
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedProject(project.id)}
                  >
                    <Text style={[styles.projectName, { color: colors.text }]}>
                      {project.name}
                    </Text>
                    {selectedProject === project.id && (
                      <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.project && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.project}
                </Text>
              )}
            </View>
          )}

          <View style={styles.prioritySection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Приоритет
            </Text>
            <View style={styles.priorityOptions}>
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  priority === 'low' && { backgroundColor: colors.info + '20', borderColor: colors.info },
                ]}
                onPress={() => setPriority('low')}
              >
                <Text style={[styles.priorityText, priority === 'low' && { color: colors.info }]}>
                  Низкий
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  priority === 'medium' && { backgroundColor: colors.secondary + '20', borderColor: colors.secondary },
                ]}
                onPress={() => setPriority('medium')}
              >
                <Text style={[styles.priorityText, priority === 'medium' && { color: colors.secondary }]}>
                  Средний
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  priority === 'high' && { backgroundColor: colors.warning + '20', borderColor: colors.warning },
                ]}
                onPress={() => setPriority('high')}
              >
                <Text style={[styles.priorityText, priority === 'high' && { color: colors.warning }]}>
                  Высокий
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  priority === 'urgent' && { backgroundColor: colors.error + '20', borderColor: colors.error },
                ]}
                onPress={() => setPriority('urgent')}
              >
                <Text style={[styles.priorityText, priority === 'urgent' && { color: colors.error }]}>
                  Срочно
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Срок выполнения
            </Text>
            <TouchableOpacity
              style={[
                styles.dateInput,
                { backgroundColor: theme === 'light' ? '#F9FAFB' : '#1F2937', borderColor: colors.border },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={colors.primary} />
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatDate(dueDate)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.hoursSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Оценка времени (часы)
            </Text>
            <Input
              placeholder="Введите количество часов"
              value={estimatedHours}
              onChangeText={(text) => {
                // Allow only numbers
                if (/^\d*$/.test(text)) {
                  setEstimatedHours(text);
                }
              }}
              keyboardType="numeric"
              leftIcon={<Clock size={20} color={colors.secondary} />}
            />
          </View>

          <View style={styles.assigneeSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Исполнитель
            </Text>
            {teamMembers.length > 0 ? (
              <View style={styles.assigneeList}>
                {teamMembers.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.assigneeItem,
                      assigneeId === member.id && {
                        backgroundColor: colors.primaryLight + '20',
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() => setAssigneeId(member.id)}
                  >
                    <Avatar
                      source={member.avatar}
                      name={member.name}
                      size="small"
                    />
                    <View style={styles.assigneeInfo}>
                      <Text style={[styles.assigneeName, { color: colors.text }]}>
                        {member.name}
                      </Text>
                      <Text style={[styles.assigneeRole, { color: colors.textSecondary }]}>
                        {member.department}
                      </Text>
                    </View>
                    {assigneeId === member.id && (
                      <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noAssigneesContainer}>
                <AlertTriangle size={24} color={colors.warning} />
                <Text style={[styles.noAssigneesText, { color: colors.textSecondary }]}>
                  {selectedProject 
                    ? 'В выбранном проекте нет участников. Сначала добавьте участников в проект.' 
                    : 'Сначала выберите проект, чтобы увидеть доступных исполнителей.'}
                </Text>
              </View>
            )}
            {errors.assignee && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.assignee}
              </Text>
            )}
          </View>

          <View style={styles.subtasksSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Подзадачи
            </Text>
            <View style={styles.addSubtaskContainer}>
              <Input
                placeholder="Введите подзадачу"
                value={newSubtask}
                onChangeText={setNewSubtask}
                containerStyle={styles.subtaskInput}
                leftIcon={<CheckSquare size={20} color={colors.secondary} />}
              />
              <Button
                title="Добавить"
                onPress={handleAddSubtask}
                variant="outline"
                size="small"
                style={styles.addSubtaskButton}
                leftIcon={<Plus size={16} color={colors.primary} />}
                disabled={!newSubtask.trim()}
              />
            </View>
            {subtasks.length > 0 && (
              <View style={styles.subtasksList}>
                {subtasks.map((subtask, index) => (
                  <View key={index} style={styles.subtaskItem}>
                    <CheckSquare size={16} color={colors.secondary} />
                    <Text style={[styles.subtaskTitle, { color: colors.text }]}>
                      {subtask.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSubtask(index)}
                      style={styles.removeSubtaskButton}
                    >
                      <Text style={[styles.removeSubtaskText, { color: colors.error }]}>
                        Удалить
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Отмена"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Создать задачу"
            onPress={handleCreateTask}
            isLoading={isLoading}
            style={styles.createButton}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formCard: {
    marginBottom: 16,
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  projectSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  projectList: {
    gap: 8,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '500',
  },
  prioritySection: {
    marginBottom: 16,
  },
  priorityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateSection: {
    marginBottom: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
  },
  hoursSection: {
    marginBottom: 16,
  },
  assigneeSection: {
    marginBottom: 16,
  },
  assigneeList: {
    gap: 8,
  },
  assigneeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  assigneeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  assigneeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  assigneeRole: {
    fontSize: 12,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  noAssigneesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    gap: 12,
  },
  noAssigneesText: {
    flex: 1,
    fontSize: 14,
  },
  subtasksSection: {
    marginBottom: 16,
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subtaskInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  addSubtaskButton: {
    marginTop: 24,
  },
  subtasksList: {
    gap: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  subtaskTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  removeSubtaskButton: {
    marginLeft: 8,
  },
  removeSubtaskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  createButton: {
    flex: 1,
    marginLeft: 8,
  },
});