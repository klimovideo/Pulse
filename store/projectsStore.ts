import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from '@/types';
import { projects as mockProjects } from '@/mocks/projects';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  filterProjects: (status?: Project['status'], search?: string) => Project[];
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: mockProjects, // Initialize with mock data
      isLoading: false,
      error: null,
      
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, you would fetch projects from an API
          // We're keeping the existing projects instead of overwriting them
          const existingProjects = get().projects;
          if (existingProjects.length === 0) {
            set({ projects: mockProjects, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ 
            error: 'Ошибка при загрузке проектов', 
            isLoading: false 
          });
        }
      },
      
      getProjectById: (id) => {
        return get().projects.find(project => project.id === id);
      },
      
      addProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newProject: Project = {
            id: Math.random().toString(36).substr(2, 9),
            ...projectData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({
            projects: [...state.projects, newProject],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при создании проекта', 
            isLoading: false 
          });
        }
      },
      
      updateProject: async (id, projectData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            projects: state.projects.map(project => 
              project.id === id 
                ? { 
                    ...project, 
                    ...projectData, 
                    updatedAt: new Date().toISOString() 
                  } 
                : project
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при обновлении проекта', 
            isLoading: false 
          });
        }
      },
      
      deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            projects: state.projects.filter(project => project.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при удалении проекта', 
            isLoading: false 
          });
        }
      },
      
      filterProjects: (status, search) => {
        const { projects } = get();
        
        return projects.filter(project => {
          const matchesStatus = !status || project.status === status;
          const matchesSearch = !search || 
            project.name.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase());
          
          return matchesStatus && matchesSearch;
        });
      },
    }),
    {
      name: 'projects-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);