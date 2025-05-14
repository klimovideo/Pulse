import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ThumbsUp, Smile, Meh, Frown, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useProjectsStore } from '@/store/projectsStore';
import { useTeamPulseStore } from '@/store/teamPulseStore';
import { useAuthStore } from '@/store/authStore';
import { TeamPulse } from '@/types';

export default function SubmitPulseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const projectId = params.projectId as string;
  
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { getProjectById } = useProjectsStore();
  const { submitPulse, isLoading } = useTeamPulseStore();
  const { user } = useAuthStore();

  const [project, setProject] = useState(getProjectById(projectId));
  const [mood, setMood] = useState<TeamPulse['mood']>('neutral');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (projectId) {
      setProject(getProjectById(projectId));
    }
  }, [projectId]);

  if (!project) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Проект не найден
        </Text>
      </SafeAreaView>
    );
  }

  const handleSubmit = async () => {
    if (!user) return;
    
    await submitPulse({
      userId: user.id,
      projectId: project.id,
      mood,
      comment: comment.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });
    
    router.push(`/pulse/${projectId}`);
  };

  const getMoodColor = (moodType: TeamPulse['mood']) => {
    switch (moodType) {
      case 'great':
        return colors.success;
      case 'good':
        return colors.success;
      case 'neutral':
        return colors.info;
      case 'concerned':
        return colors.warning;
      case 'stressed':
        return colors.error;
      default:
        return colors.secondary;
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>
          Пульс проекта
        </Text>
        
        <TouchableOpacity onPress={() => router.push(`/projects/${projectId}`)}>
          <Text style={[styles.projectName, { color: colors.primary }]}>
            {project.name}
          </Text>
        </TouchableOpacity>

        <Card variant="elevated" style={styles.moodCard}>
          <Text style={[styles.question, { color: colors.text }]}>
            Как вы оцениваете свое настроение в работе над проектом?
          </Text>

          <View style={styles.moodOptions}>
            <TouchableOpacity
              style={[
                styles.moodOption,
                mood === 'great' && { backgroundColor: getMoodColor('great') + '20', borderColor: getMoodColor('great') },
              ]}
              onPress={() => setMood('great')}
            >
              <ThumbsUp size={32} color={getMoodColor('great')} />
              <Text style={[styles.moodText, { color: getMoodColor('great') }]}>
                Отлично
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.moodOption,
                mood === 'good' && { backgroundColor: getMoodColor('good') + '20', borderColor: getMoodColor('good') },
              ]}
              onPress={() => setMood('good')}
            >
              <Smile size={32} color={getMoodColor('good')} />
              <Text style={[styles.moodText, { color: getMoodColor('good') }]}>
                Хорошо
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.moodOption,
                mood === 'neutral' && { backgroundColor: getMoodColor('neutral') + '20', borderColor: getMoodColor('neutral') },
              ]}
              onPress={() => setMood('neutral')}
            >
              <Meh size={32} color={getMoodColor('neutral')} />
              <Text style={[styles.moodText, { color: getMoodColor('neutral') }]}>
                Нормально
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.moodOption,
                mood === 'concerned' && { backgroundColor: getMoodColor('concerned') + '20', borderColor: getMoodColor('concerned') },
              ]}
              onPress={() => setMood('concerned')}
            >
              <Frown size={32} color={getMoodColor('concerned')} />
              <Text style={[styles.moodText, { color: getMoodColor('concerned') }]}>
                Беспокойство
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.moodOption,
                mood === 'stressed' && { backgroundColor: getMoodColor('stressed') + '20', borderColor: getMoodColor('stressed') },
              ]}
              onPress={() => setMood('stressed')}
            >
              <AlertCircle size={32} color={getMoodColor('stressed')} />
              <Text style={[styles.moodText, { color: getMoodColor('stressed') }]}>
                Стресс
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card variant="elevated" style={styles.commentCard}>
          <Text style={[styles.commentLabel, { color: colors.text }]}>
            Комментарий (необязательно)
          </Text>
          <TextInput
            style={[
              styles.commentInput,
              {
                color: colors.text,
                backgroundColor: theme === 'light' ? '#F9FAFB' : '#1F2937',
                borderColor: colors.border,
              },
            ]}
            placeholder="Поделитесь своими мыслями о проекте..."
            placeholderTextColor={colors.secondary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        <View style={styles.actions}>
          <Button
            title="Отмена"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Отправить"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
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
    marginBottom: 4,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
  moodCard: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodOption: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  commentCard: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
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
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});