import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

interface CardProps {
  children: React.ReactNode;
  variant?: 'flat' | 'elevated' | 'outlined' | 'highlight';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'flat',
  style,
  ...props
}) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [
          styles.card,
          {
            backgroundColor: colors.card,
            shadowColor: theme === 'light' ? '#000000' : '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme === 'light' ? 0.1 : 0.25,
            shadowRadius: 8,
            elevation: 4,
          },
          style,
        ];
      case 'outlined':
        return [
          styles.card,
          {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
          },
          style,
        ];
      case 'highlight':
        return [
          styles.card,
          {
            backgroundColor: colors.cardHighlight,
            shadowColor: theme === 'light' ? '#000000' : '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: theme === 'light' ? 0.05 : 0.15,
            shadowRadius: 4,
            elevation: 2,
          },
          style,
        ];
      default:
        return [
          styles.card,
          {
            backgroundColor: colors.card,
          },
          style,
        ];
    }
  };

  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
});