import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Activity } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

interface PulseIndicatorProps {
  score: number; // 0 to 100
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: ViewStyle;
}

export const PulseIndicator: React.FC<PulseIndicatorProps> = ({
  score,
  size = 'medium',
  showLabel = true,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  // Ensure score is between 0 and 100
  const clampedScore = Math.min(Math.max(score, 0), 100);

  // Determine color based on score
  const getScoreColor = (): string => {
    if (clampedScore < 30) {
      return colors.error;
    } else if (clampedScore < 70) {
      return colors.warning;
    } else {
      return colors.success;
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

  const iconSize = getSize();
  const scoreColor = getScoreColor();

  return (
    <View style={[styles.container, style]}>
      <Activity size={iconSize} color={scoreColor} />
      {showLabel && (
        <Text style={[styles.label, { color: scoreColor }]}>
          {Math.round(clampedScore)}
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