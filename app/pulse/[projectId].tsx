import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MoodIndicator } from '@/components/ui/MoodIndicator';
import { Divider } from '@/components/ui/Divider';
import { Avatar } from '@/components/ui/Avatar';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  MessageSquare,
  Plus
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useTeamPulseStore } from '@/store/teamPulseStore';
import { useProjectsStore } from '@/store/projectsStore';
import { useAuthStore } from '@/store/authStore';
import { TeamPulse } from '@/types';

export default function ProjectPulseScreen() {
  const { projectId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { teamPulse, fetchTeamPulse } = useTeamPulseStore();
  const { getProjectById } = useProjectsStore();
  const { getUserById } = useAuthStore();

  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    if (projectId) {
      fetchTeamPulse(projectId as string);
    }
  }, [projectId]);

  const project = getProjectById(projectId as string);

  if (!project) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Проект не найден</Text>
      </SafeAreaView>
    );
  }

  // Filter pulse data by timeframe
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const filteredPulse = teamPulse.filter(pulse => {
    if (pulse.projectId !== projectId) return false;
    
    const pulseDate = new Date(pulse.date);
    
    if (timeframe === 'week') {
      return pulseDate >= oneWeekAgo;
    } else if (timeframe === 'month') {
      return pulseDate >= oneMonthAgo;
    }
    
    return true; // 'all' timeframe
  });

  // Calculate average mood
  const moodValues = {
    'great': 5,
    'good': 4,
    'neutral': 3,
    'concerned': 2,
    'stressed': 1
  };

  const averageMood = filteredPulse.length > 0
    ? filteredPulse.reduce((sum, pulse) => sum + moodValues[pulse.mood], 0) / filteredPulse.length
    : 0;

  // Get mood distribution
  const moodDistribution = filteredPulse.reduce((acc, pulse) => {
    acc[pulse.mood] = (acc[pulse.mood] || 0) + 1;
    return acc;
  }, {} as Record<TeamPulse['mood'], number>);

  // Get trend (comparing current week with previous week)
  const previousWeekStart = new Date(oneWeekAgo);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const currentWeekPulse = teamPulse.filter(pulse => {
    if (pulse.projectId !== projectId) return false;
    const pulseDate = new Date(pulse.date);
    return pulseDate >= oneWeekAgo;
  });

  const previousWeekPulse = teamPulse.filter(pulse => {
    if (pulse.projectId !== projectId) return false;
    const pulseDate = new Date(pulse.date);
    return pulseDate >= previousWeekStart && pulseDate < oneWeekAgo;
  });

  const currentWeekAvg = currentWeekPulse.length > 0
    ? currentWeekPulse.reduce((sum, pulse) => sum + moodValues[pulse.mood], 0) / currentWeekPulse.length
    : 0;

  const previousWeekAvg = previousWeekPulse.length > 0
    ? previousWeekPulse.reduce((sum, pulse) => sum + moodValues[pulse.mood], 0) / previousWeekPulse.length
    : 0;

  const trend = currentWeekAvg - previousWeekAvg;

  // Get recent comments
  const recentComments = filteredPulse
    .filter(pulse => pulse.comment)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Get mood name from value
  const getMoodName = (value: number): TeamPulse['mood'] | null => {
    if (value >= 4.5) return 'great';
    if (value >= 3.5) return 'good';
    if (value >= 2.5) return 'neutral';
    if (value >= 1.5) return 'concerned';
    if (value > 0) return 'stressed';
    return null;
  };

  const averageMoodName = getMoodName(averageMood);

  const handleSubmitPulse = () => {
    router.push(`/pulse/submit?projectId=${projectId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Пульс команды
          </Text>
          <Button
            title="Оставить отзыв"
            onPress={handleSubmitPulse}
            leftIcon={<Plus size={20} color="#FFFFFF" />}
            size="small"
          />
        </View>

        <Text style={[styles.projectName, { color: colors.text }]}>
          {project.name}
        </Text>

        <View style={styles.timeframeSelector}>
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              timeframe === 'week' && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            ]}
            onPress={() => setTimeframe('week')}
          >
            <Text
              style={[
                styles.timeframeButtonText,
                timeframe === 'week' && { color: colors.primary },
              ]}
            >
              Неделя
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              timeframe === 'month' && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            ]}
            onPress={() => setTimeframe('month')}
          >
            <Text
              style={[
                styles.timeframeButtonText,
                timeframe === 'month' && { color: colors.primary },
              ]}
            >
              Месяц
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeframeButton,
              timeframe === 'all' && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            ]}
            onPress={() => setTimeframe('all')}
          >
            <Text
              style={[
                styles.timeframeButtonText,
                timeframe === 'all' && { color: colors.primary },
              ]}
            >
              Все время
            </Text>
          </TouchableOpacity>
        </View>

        <Card variant="elevated" style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={[styles.overviewTitle, { color: colors.text }]}>
              Общее настроение команды
            </Text>
            <View style={styles.pulseCount}>
              <Users size={16} color={colors.secondary} />
              <Text style={[styles.pulseCountText, { color: colors.textSecondary }]}>
                {filteredPulse.length} отзывов
              </Text>
            </View>
          </View>

          <View style={styles.moodContainer}>
            {averageMoodName ? (
              <>
                <MoodIndicator mood={averageMoodName} size="large" />
                <Text style={[styles.moodText, { color: colors.text }]}>
                  {averageMoodName === 'great' && 'Отлично'}
                  {averageMoodName === 'good' && 'Хорошо'}
                  {averageMoodName === 'neutral' && 'Нейтрально'}
                  {averageMoodName === 'concerned' && 'Есть проблемы'}
                  {averageMoodName === 'stressed' && 'Стресс'}
                </Text>
              </>
            ) : (
              <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
                Нет данных
              </Text>
            )}
          </View>

          {trend !== 0 && (
            <View style={styles.trendContainer}>
              {trend > 0 ? (
                <>
                  <TrendingUp size={16} color={colors.success} />
                  <Text style={[styles.trendText, { color: colors.success }]}>
                    Улучшение по сравнению с прошлой неделей
                  </Text>
                </>
              ) : (
                <>
                  <TrendingDown size={16} color={colors.error} />
                  <Text style={[styles.trendText, { color: colors.error }]}>
                    Ухудшение по сравнению с прошлой неделей
                  </Text>
                </>
              )}
            </View>
          )}
        </Card>

        <Card variant="elevated" style={styles.distributionCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Распределение настроения
          </Text>

          {Object.keys(moodDistribution).length > 0 ? (
            <View style={styles.moodDistribution}>
              {Object.entries(moodDistribution).map(([mood, count]) => (
                <View key={mood} style={styles.moodDistributionItem}>
                  <MoodIndicator mood={mood as TeamPulse['mood']} size="small" />
                  <Text style={[styles.moodDistributionText, { color: colors.textSecondary }]}>
                    {String(count)} {count === 1 ? 'отзыв' : count < 5 ? 'отзыва' : 'отзывов'}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
              Нет данных для отображения
            </Text>
          )}
        </Card>

        <Card variant="elevated" style={styles.commentsCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Последние комментарии
          </Text>

          {recentComments.length > 0 ? (
            <View style={styles.commentsList}>
              {recentComments.map((pulse, index) => {
                const user = getUserById(pulse.userId);
                return (
                  <React.Fragment key={pulse.id}>
                    <View style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <View style={styles.commentUser}>
                          <Avatar
                            source={user?.avatar}
                            name={user?.name}
                            size="small"
                          />
                          <Text style={[styles.commentUserName, { color: colors.text }]}>
                            {user?.name || 'Пользователь'}
                          </Text>
                        </View>
                        <View style={styles.commentMeta}>
                          <MoodIndicator mood={pulse.mood} size="small" />
                          <Text style={[styles.commentDate, { color: colors.textSecondary }]}>
                            {new Date(pulse.date).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.commentText, { color: colors.text }]}>
                        {pulse.comment}
                      </Text>
                    </View>
                    {index < recentComments.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </View>
          ) : (
            <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
              Нет комментариев для отображения
            </Text>
          )}
        </Card>

        <Button
          title="Оставить отзыв о проекте"
          onPress={handleSubmitPulse}
          style={styles.submitButton}
        />
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
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  projectName: {
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
  timeframeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  timeframeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  overviewCard: {
    padding: 16,
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  pulseCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseCountText: {
    fontSize: 12,
    marginLeft: 4,
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  moodText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendText: {
    fontSize: 14,
    marginLeft: 4,
  },
  distributionCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  moodDistribution: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodDistributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  moodDistributionText: {
    fontSize: 14,
    marginLeft: 8,
  },
  commentsCard: {
    padding: 16,
    marginBottom: 16,
  },
  commentsList: {
    
  },
  commentItem: {
    marginVertical: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: 24,
  },
});