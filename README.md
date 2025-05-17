# PulseReact

Мобильное приложение для управления проектами и задачами.

## Структура проекта

- `app/` - Файлы маршрутизации React Native (Expo Router)
- `components/` - Компоненты React Native
- `constants/` - Константы и конфигурации
- `store/` - Состояние приложения (Zustand)
- `types/` - TypeScript типы и интерфейсы
- `backend/` - Серверное API на Node.js + Express

## Требования

- Node.js 14+
- npm или yarn
- MongoDB (опционально, для полноценной работы бэкенда)

## Установка

1. Клонировать репозиторий
   ```
   git clone <repository-url>
   cd PulseReact
   ```

2. Установить зависимости
   ```
   npm install --legacy-peer-deps
   cd backend && npm install && cd ..
   ```

3. Создать файл .env в директории backend/
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/pulsereact
   JWT_SECRET=your_jwt_secret_key
   ```

## Запуск

### Запуск только фронтенда
```
npm start
```

### Запуск только бэкенда
```
npm run backend
```

### Запуск фронтенда и бэкенда одновременно
```
npm run dev
```

## Функциональность

- Аутентификация пользователей
- Управление проектами и задачами
- Система уведомлений
- Отслеживание прогресса задач
- Система обратной связи по проектам ("Пульс")

## Технологии

- React Native / Expo
- TypeScript
- Zustand (управление состоянием)
- Node.js / Express
- MongoDB 