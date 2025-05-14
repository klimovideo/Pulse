import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, Lock, User } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { login, register, isLoading, error } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};
    let isValid = true;

    if (mode === 'register' && !name.trim()) {
      errors.name = 'Имя обязательно';
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = 'Email обязателен';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Некорректный email';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Пароль обязателен';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  return (
    <View style={styles.container}>
      {mode === 'register' && (
        <Input
          label="Имя"
          placeholder="Введите ваше имя"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={20} color={colors.secondary} />}
          error={validationErrors.name}
          autoCapitalize="words"
        />
      )}

      <Input
        label="Email"
        placeholder="Введите ваш email"
        value={email}
        onChangeText={setEmail}
        leftIcon={<Mail size={20} color={colors.secondary} />}
        error={validationErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Пароль"
        placeholder="Введите ваш пароль"
        value={password}
        onChangeText={setPassword}
        leftIcon={<Lock size={20} color={colors.secondary} />}
        error={validationErrors.password}
        isPassword
      />

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}

      <Button
        title={mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.button}
        fullWidth
      />

      {mode === 'login' && (
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
            Забыли пароль?
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
  },
});