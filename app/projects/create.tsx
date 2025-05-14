import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, Users, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useProjectsStore } from '@/store/projectsStore';
import { useAuthStore } from '@/store/authStore';
import { users } from '@/mocks/users';
import { Platform } from 'react-native';

export default function CreateProjectScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { addProject, isLoading } = useProjectsStore();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // +30 days
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    dates?: string;
  }>({});

  const availableUsers = users.filter(u => u.id !== user?.id);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000)); // +7 days from start
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const toggleTeamMember = (userId: string) => {
    if (teamMembers.includes(userId)) {
      setTeamMembers(teamMembers.filter(id => id !== userId));
    } else {
      setTeamMembers([...teamMembers, userId]);
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      description?: string;
      dates?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Название проекта обязательно';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Описание проекта обязательно';
      isValid = false;
    }

    if (startDate >= endDate) {
      newErrors.dates = 'Дата окончания должна быть позже даты начала';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateProject = async () => {
    if (!validateForm()) return;

    const newProject = {
      name,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'planning' as const,
      progress: 0,
      teamMembers,
      managerId: user?.id || '1',
    };

    try {
      await addProject(newProject);
      Alert.alert("Успех", "Проект успешно создан!");
      router.push('/projects');
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось создать проект. Попробуйте еще раз.");
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>
          Создание нового проекта
        </Text>

        <Card variant="elevated" style={styles.formCard}>
          <Input
            label="Название проекта"
            placeholder="Введите название проекта"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <View style={styles.textAreaContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Описание проекта
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
              placeholder="Введите описание проекта"
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

          <View style={styles.dateSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Сроки проекта
            </Text>

            <View style={styles.dateInputs}>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  { backgroundColor: theme === 'light' ? '#F9FAFB' : '#1F2937', borderColor: colors.border },
                ]}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Calendar size={20} color={colors.primary} />
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.dateConnector, { color: colors.textSecondary }]}>—</Text>

              <TouchableOpacity
                style={[
                  styles.dateInput,
                  { backgroundColor: theme === 'light' ? '#F9FAFB' : '#1F2937', borderColor: colors.border },
                ]}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Calendar size={20} color={colors.primary} />
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {errors.dates && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.dates}
              </Text>
            )}

            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
                minimumDate={new Date()}
              />
            )}

            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)} // +1 day from start
              />
            )}
          </View>

          <View style={styles.teamSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Команда проекта
              </Text>
              <Text style={[styles.teamCount, { color: colors.textSecondary }]}>
                Выбрано: {teamMembers.length}
              </Text>
            </View>

            <View style={styles.teamList}>
              {availableUsers.map(member => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.teamMember,
                    teamMembers.includes(member.id) && {
                      backgroundColor: colors.primaryLight + '20',
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => toggleTeamMember(member.id)}
                >
                  <Avatar
                    source={member.avatar}
                    name={member.name}
                    size="small"
                  />
                  <View style={styles.memberInfo}>
                    <Text style={[styles.memberName, { color: colors.text }]}>
                      {member.name}
                    </Text>
                    <Text style={[styles.memberRole, { color: colors.textSecondary }]}>
                      {member.department}
                    </Text>
                  </View>
                  {teamMembers.includes(member.id) && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
            title="Создать проект"
            onPress={handleCreateProject}
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
  dateSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
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
  dateConnector: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  teamSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamCount: {
    fontSize: 14,
  },
  teamList: {
    gap: 8,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 12,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
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