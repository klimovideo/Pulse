import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import Colors from "@/constants/colors";

import { ErrorBoundary } from "./error-boundary";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Назад",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="projects/[id]" 
            options={{ 
              title: "Проект",
              presentation: "card",
            }} 
          />
          <Stack.Screen 
            name="tasks/[id]" 
            options={{ 
              title: "Задача",
              presentation: "card",
            }} 
          />
          <Stack.Screen 
            name="pulse/[projectId]" 
            options={{ 
              title: "Пульс проекта",
              presentation: "card",
            }} 
          />
          <Stack.Screen 
            name="projects/create" 
            options={{ 
              title: "Новый проект",
              presentation: "card",
            }} 
          />
          <Stack.Screen 
            name="tasks/create" 
            options={{ 
              title: "Новая задача",
              presentation: "card",
            }} 
          />
          <Stack.Screen 
            name="profile/edit" 
            options={{ 
              title: "Редактирование профиля",
              presentation: "card",
            }} 
          />
          <Stack.Screen 
            name="pulse/submit" 
            options={{ 
              title: "Отправить отзыв",
              presentation: "card",
            }} 
          />
        </>
      ) : (
        <Stack.Screen 
          name="auth" 
          options={{ 
            headerShown: false,
            animation: "fade",
          }} 
        />
      )}
    </Stack>
  );
}