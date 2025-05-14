import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthForm } from '@/components/auth/AuthForm';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

export default function AuthScreen() {
  const { theme, toggleTheme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={['#E30613', '#FF4D57']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoContainer}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=80&auto=format&fit=crop' }}
                style={styles.logo}
              />
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>
              ПроектМенеджер Plus
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Управляйте проектами эффективно
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  mode === 'login' && [styles.activeTab, { borderBottomColor: colors.primary }],
                ]}
                onPress={() => setMode('login')}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: mode === 'login' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Вход
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  mode === 'register' && [styles.activeTab, { borderBottomColor: colors.primary }],
                ]}
                onPress={() => setMode('register')}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: mode === 'register' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  Регистрация
                </Text>
              </TouchableOpacity>
            </View>

            <AuthForm mode={mode} />

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={[styles.footerLink, { color: colors.primary }]}>
                  {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Text style={[styles.themeToggleText, { color: colors.textSecondary }]}>
              {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeToggle: {
    marginTop: 40,
    alignItems: 'center',
  },
  themeToggleText: {
    fontSize: 14,
  },
});