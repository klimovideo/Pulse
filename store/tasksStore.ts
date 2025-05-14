import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, SubTask, Comment } from '@/types';
import { tasks as mockTasks } from '@/mocks/tasks';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchProjectTasks: (projectId: string) => Promise<Task[]>;
  getTaskById: (id: string) => Task | undefined;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subtasks' | 'comments'>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addSubtask: (taskId: string, subtask: Omit<SubTask, 'id'>) => Promise<void>;
  updateSubtask: (taskId: string, subtaskId: string, completed: boolean) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addComment: (taskId: string, userId: string, text: string) => Promise<void>;
  deleteComment: (taskId: string, commentId: string) => Promise<void>;
  filterTasks: (projectId?: string, status?: Task['status'], priority?: Task['priority'], assigneeId?: string, search?: string) => Task[];
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks, // Initialize with mock data
      isLoading: false,
      error: null,
      
      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, you would fetch tasks from an API
          // We're keeping the existing tasks instead of overwriting them
          const existingTasks = get().tasks;
          if (existingTasks.length === 0) {
            set({ tasks: mockTasks, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ 
            error: 'Ошибка при загрузке задач', 
            isLoading: false 
          });
        }
      },
      
      fetchProjectTasks: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get all tasks and filter by project ID
          const allTasks = get().tasks;
          const projectTasks = allTasks.filter(task => task.projectId === projectId);
          
          // We're not setting the tasks here, just returning the loading state
          set({ isLoading: false });
          
          return projectTasks;
        } catch (error) {
          set({ 
            error: 'Ошибка при загрузке задач проекта', 
            isLoading: false 
          });
          return [];
        }
      },
      
      getTaskById: (id) => {
        return get().tasks.find(task => task.id === id);
      },
      
      addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            ...taskData,
            subtasks: [],
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({
            tasks: [...state.tasks, newTask],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при создании задачи', 
            isLoading: false 
          });
        }
      },
      
      updateTask: async (id, taskData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === id 
                ? { 
                    ...task, 
                    ...taskData, 
                    updatedAt: new Date().toISOString() 
                  } 
                : task
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при обновлении задачи', 
            isLoading: false 
          });
        }
      },
      
      deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при удалении задачи', 
            isLoading: false 
          });
        }
      },
      
      addSubtask: async (taskId, subtaskData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newSubtask: SubTask = {
            id: Math.random().toString(36).substr(2, 9),
            ...subtaskData,
          };
          
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === taskId 
                ? { 
                    ...task, 
                    subtasks: [...(task.subtasks || []), newSubtask],
                    updatedAt: new Date().toISOString() 
                  } 
                : task
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при добавлении подзадачи', 
            isLoading: false 
          });
        }
      },
      
      updateSubtask: async (taskId, subtaskId, completed) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === taskId 
                ? { 
                    ...task, 
                    subtasks: task.subtasks?.map(subtask => 
                      subtask.id === subtaskId 
                        ? { ...subtask, completed } 
                        : subtask
                    ),
                    updatedAt: new Date().toISOString() 
                  } 
                : task
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при обновлении подзадачи', 
            isLoading: false 
          });
        }
      },
      
      deleteSubtask: async (taskId, subtaskId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === taskId 
                ? { 
                    ...task, 
                    subtasks: task.subtasks?.filter(subtask => subtask.id !== subtaskId),
                    updatedAt: new Date().toISOString() 
                  } 
                : task
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при удалении подзадачи', 
            isLoading: false 
          });
        }
      },
      
      addComment: async (taskId, userId, text) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newComment: Comment = {
            id: Math.random().toString(36).substr(2, 9),
            taskId,
            userId,
            text,
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === taskId 
                ? { 
                    ...task, 
                    comments: [...(task.comments || []), newComment],
                    updatedAt: new Date().toISOString() 
                  } 
                : task
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при добавлении комментария', 
            isLoading: false 
          });
        }
      },
      
      deleteComment: async (taskId, commentId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === taskId 
                ? { 
                    ...task, 
                    comments: task.comments?.filter(comment => comment.id !== commentId),
                    updatedAt: new Date().toISOString() 
                  } 
                : task
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при удалении комментария', 
            isLoading: false 
          });
        }
      },
      
      filterTasks: (projectId, status, priority, assigneeId, search) => {
        const { tasks } = get();
        
        return tasks.filter(task => {
          const matchesProject = !projectId || task.projectId === projectId;
          const matchesStatus = !status || task.status === status;
          const matchesPriority = !priority || task.priority === priority;
          const matchesAssignee = !assigneeId || task.assigneeId === assigneeId;
          const matchesSearch = !search || 
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase());
          
          return matchesProject && matchesStatus && matchesPriority && matchesAssignee && matchesSearch;
        });
      },
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);