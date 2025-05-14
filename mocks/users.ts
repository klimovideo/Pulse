import { User } from '@/types';

export const currentUser: User = {
  id: 'user1',
  name: 'Иван Петров',
  email: 'ivan@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  role: 'manager',
  department: 'Разработка',
};

export const users: User[] = [
  currentUser,
  {
    id: 'user2',
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'employee',
    department: 'Дизайн',
  },
  {
    id: 'user3',
    name: 'Алексей Иванов',
    email: 'alexey@example.com',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'employee',
    department: 'Разработка',
  },
  {
    id: 'user4',
    name: 'Мария Козлова',
    email: 'maria@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'employee',
    department: 'Маркетинг',
  },
  {
    id: 'user5',
    name: 'Дмитрий Соколов',
    email: 'dmitry@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'admin',
    department: 'Руководство',
  },
];