import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Smile, Meh, Frown, AlertCircle, ThumbsUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { TeamPulse } from '@/types';

interface MoodIndicatorProps {
  mood: TeamPulse['mood'];
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: ViewStyle;
}

export const MoodIndicator: React.FC<MoodIndicatorProps> = ({
  mood,
  size = 'medium',
  showLabel = true,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  const getMoodConfig = () => {
    switch (mood) {
      case 'great':
        return {
          icon: <ThumbsUp size={getSize()} color={colors.success} />,
          label: 'Отлично',
          color: colors.success,
        };
      case 'good':
        return {
          icon: <Smile size={getSize()} color={colors.success} />,
          label: 'Хорошо',
          color: colors.success,
        };
      case 'neutral':
        return {
          icon: <Meh size={getSize()} color={colors.info} />,
          label: 'Нормально',
          color: colors.info,
        };
      case 'concerned':
        return {
          icon: <Frown size={getSize()} color={colors.warning} />,
          label: 'Беспокойство',
          color: colors.warning,
        };
      case 'stressed':
        return {
          icon: <AlertCircle size={getSize()} color={colors.error} />,
          label: 'Стресс',
          color: colors.error,
        };
      default:
        return {
          icon: <Meh size={getSize()} color={colors.secondary} />,
          label: 'Неизвестно',
          color: colors.secondary,
        };
    }
  };

  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const { icon, label, color } = getMoodConfig();

  return (
    <View style={[styles.container, style]}>
      {icon}
      {showLabel && (
        <Text style={[styles.label, { color }]}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});