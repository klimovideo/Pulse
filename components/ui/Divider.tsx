import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  thickness?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  thickness = 1,
  style,
}) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  return (
    <View
      style={[
        direction === 'horizontal' ? styles.horizontal : styles.vertical,
        {
          backgroundColor: colors.border,
          height: direction === 'horizontal' ? thickness : '100%',
          width: direction === 'vertical' ? thickness : '100%',
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});