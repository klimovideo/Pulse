import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Users } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProjectStatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { Project } from '@/types';
import { users } from '@/mocks/users';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const manager = users.find(user => user.id === project.managerId);

  const handlePress = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {project.name}
          </Text>
          <ProjectStatusBadge status={project.status} />
        </View>
        
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {project.description}
        </Text>
        
        <View style={styles.progressContainer}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            Прогресс
          </Text>
          <ProgressBar progress={project.progress} height={6} />
        </View>
        
        <View style={styles.footer}>
          <View style={styles.infoItem}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </Text>
          </View>
          
          <View style={styles.teamContainer}>
            <View style={styles.infoItem}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {project.teamMembers.length}
              </Text>
            </View>
            
            <View style={styles.avatarsContainer}>
              {project.teamMembers.slice(0, 3).map((memberId) => {
                const member = users.find(user => user.id === memberId);
                return (
                  <View key={memberId} style={styles.avatarWrapper}>
                    <Avatar
                      source={member?.avatar}
                      name={member?.name}
                      size="small"
                    />
                  </View>
                );
              })}
              {project.teamMembers.length > 3 && (
                <View style={[styles.moreAvatars, { backgroundColor: colors.secondary }]}>
                  <Text style={styles.moreAvatarsText}>+{project.teamMembers.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarsContainer: {
    flexDirection: 'row',
  },
  avatarWrapper: {
    marginLeft: -8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreAvatars: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreAvatarsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});