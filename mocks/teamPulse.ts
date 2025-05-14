import { TeamPulse } from '@/types';

export const teamPulse: TeamPulse[] = [
  {
    id: '1',
    userId: '2',
    projectId: '1',
    mood: 'good',
    comment: 'Проект идет по плану, но есть небольшие задержки с утверждением дизайна.',
    date: '2023-10-15',
  },
  {
    id: '2',
    userId: '4',
    projectId: '1',
    mood: 'great',
    comment: 'Очень доволен прогрессом и командной работой.',
    date: '2023-10-15',
  },
  {
    id: '3',
    userId: '6',
    projectId: '1',
    mood: 'neutral',
    comment: 'Работа идет нормально, но хотелось бы больше ясности по некоторым требованиям.',
    date: '2023-10-15',
  },
  {
    id: '4',
    userId: '3',
    projectId: '2',
    mood: 'concerned',
    comment: 'Беспокоюсь о сроках, нам может потребоваться дополнительное время.',
    date: '2023-10-20',
  },
  {
    id: '5',
    userId: '5',
    projectId: '2',
    mood: 'stressed',
    comment: 'Слишком много задач и мало времени, нужна помощь.',
    date: '2023-10-20',
  },
  {
    id: '6',
    userId: '2',
    projectId: '3',
    mood: 'good',
    comment: 'Маркетинговая кампания развивается хорошо, получаем положительные отзывы.',
    date: '2023-10-25',
  },
  {
    id: '7',
    userId: '6',
    projectId: '3',
    mood: 'good',
    comment: 'Работа интересная, но график напряженный.',
    date: '2023-10-25',
  },
];

// Агрегированные данные по пульсу проектов
export const projectPulseData = [
  {
    projectId: '1',
    date: '2023-10-15',
    averageMood: 'good', // Средний показатель настроения
    moodDistribution: {
      great: 1,
      good: 1,
      neutral: 1,
      concerned: 0,
      stressed: 0,
    },
    teamParticipation: 100, // Процент участия команды в опросе
  },
  {
    projectId: '2',
    date: '2023-10-20',
    averageMood: 'concerned',
    moodDistribution: {
      great: 0,
      good: 0,
      neutral: 0,
      concerned: 1,
      stressed: 1,
    },
    teamParticipation: 100,
  },
  {
    projectId: '3',
    date: '2023-10-25',
    averageMood: 'good',
    moodDistribution: {
      great: 0,
      good: 2,
      neutral: 0,
      concerned: 0,
      stressed: 0,
    },
    teamParticipation: 100,
  },
];