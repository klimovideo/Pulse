import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TeamPulse } from '@/types';
import { teamPulse as mockTeamPulse, projectPulseData as mockProjectPulseData } from '@/mocks/teamPulse';

interface TeamPulseState {
  teamPulse: TeamPulse[];
  projectPulseData: any[]; // Агрегированные данные по пульсу проектов
  isLoading: boolean;
  error: string | null;
  fetchTeamPulse: (projectId: string) => Promise<void>;
  fetchProjectPulseData: (projectId: string) => Promise<void>;
  submitPulse: (pulse: Omit<TeamPulse, 'id'>) => Promise<void>;
}

export const useTeamPulseStore = create<TeamPulseState>()(
  persist(
    (set, get) => ({
      teamPulse: [],
      projectPulseData: [],
      isLoading: false,
      error: null,
      
      fetchTeamPulse: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would fetch team pulse data for a specific project from an API
          const projectTeamPulse = mockTeamPulse.filter(pulse => pulse.projectId === projectId);
          set({ teamPulse: projectTeamPulse, isLoading: false });
        } catch (error) {
          set({ 
            error: 'Ошибка при загрузке данных о настроении команды', 
            isLoading: false 
          });
        }
      },
      
      fetchProjectPulseData: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would fetch aggregated pulse data for a specific project from an API
          const projectData = mockProjectPulseData.filter(data => data.projectId === projectId);
          set({ projectPulseData: projectData, isLoading: false });
        } catch (error) {
          set({ 
            error: 'Ошибка при загрузке агрегированных данных о пульсе проекта', 
            isLoading: false 
          });
        }
      },
      
      submitPulse: async (pulseData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newPulse: TeamPulse = {
            id: Math.random().toString(36).substr(2, 9),
            ...pulseData,
          };
          
          set(state => ({
            teamPulse: [...state.teamPulse, newPulse],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при отправке данных о настроении', 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'team-pulse-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);