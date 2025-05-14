import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  showLabel?: boolean;
  color?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showLabel = false,
  color,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  // Determine color based on progress
  const getProgressColor = (): string => {
    if (color) return color;
    
    if (clampedProgress < 30) {
      return colors.error;
    } else if (clampedProgress < 70) {
      return colors.warning;
    } else {
      return colors.success;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {Math.round(clampedProgress)}%
        </Text>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme === 'light' ? '#F3F4F6' : '#374151',
          },
        ]}
      >
        <View
          style={[
            styles.progress,
            {
              width: `${clampedProgress}%`,
              height,
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'right',
  },
  track: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
});