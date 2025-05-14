export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'manager' | 'employee';
    department?: string;
  };
  
  export type Project = {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'planning' | 'in_progress' | 'on_hold' | 'active' | 'completed' | 'archived';
    progress: number;
    teamMembers: string[];
    managerId: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Task = {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'review' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigneeId: string;
    creatorId: string;
    dueDate: string;
    estimatedHours?: number;
    actualHours?: number;
    subtasks?: SubTask[];
    attachments?: Attachment[];
    comments?: Comment[];
    createdAt: string;
    updatedAt: string;
    pulseScore?: number; // 0-100 score indicating task health
  };
  
  export type SubTask = {
    id: string;
    taskId: string;
    title: string;
    completed: boolean;
    assigneeId?: string;
  };
  
  export type Comment = {
    id: string;
    taskId: string;
    userId: string;
    text: string;
    createdAt: string;
  };
  
  export type Attachment = {
    id: string;
    taskId: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
  };
  
  export type TeamPulse = {
    id: string;
    userId: string;
    projectId: string;
    mood: 'great' | 'good' | 'neutral' | 'concerned' | 'stressed';
    comment?: string;
    date: string;
  };
  
  export type Notification = {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'task_assigned' | 'task_updated' | 'comment' | 'deadline' | 'mention' | 'pulse_request';
    read: boolean;
    relatedItemId?: string;
    relatedItemType?: 'task' | 'project' | 'comment';
    createdAt: string;
  };
  
  export type ThemeType = 'light' | 'dark';