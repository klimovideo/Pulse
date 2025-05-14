import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { 
  User, 
  Mail, 
  Briefcase, 
  Edit, 
  LogOut, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  HelpCircle 
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { user, logout } = useAuthStore();

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Профиль
          </Text>
          <Button
            title="Редактировать"
            onPress={handleEditProfile}
            leftIcon={<Edit size={20} color="#FFFFFF" />}
            size="small"
          />
        </View>

        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar 
              source={user?.avatar} 
              name={user?.name} 
              size="large" 
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.name || 'Пользователь'}
              </Text>
              <Text style={[styles.profileRole, { color: colors.textSecondary }]}>
                {user?.role || 'Сотрудник'}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Mail size={20} color={colors.secondary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {user?.email || 'email@example.com'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Briefcase size={20} color={colors.secondary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {user?.department || 'Не указан'}
              </Text>
            </View>
          </View>
        </Card>

        <Card variant="elevated" style={styles.settingsCard}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>
            Настройки
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              {theme === 'light' ? (
                <Sun size={20} color={colors.secondary} />
              ) : (
                <Moon size={20} color={colors.secondary} />
              )}
              <Text style={[styles.settingText, { color: colors.text }]}>
                Темная тема
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E5E7EB', true: colors.primaryLight }}
              thumbColor={theme === 'dark' ? colors.primary : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.secondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Уведомления
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.primary }]}>
              Настроить
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={colors.secondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Конфиденциальность
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.primary }]}>
              Настроить
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={colors.secondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Помощь и поддержка
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        <Button
          title="Выйти из аккаунта"
          onPress={handleLogout}
          variant="outline"
          leftIcon={<LogOut size={20} color={colors.error} />}
          style={styles.logoutButton}
          textStyle={{ color: colors.error }}
        />

        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          Версия 1.0.0
        </Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
  },
  divider: {
    marginBottom: 16,
  },
  profileDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 12,
  },
  settingsCard: {
    marginBottom: 16,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 14,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
});