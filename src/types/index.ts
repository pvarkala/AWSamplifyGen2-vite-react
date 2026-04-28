export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  isActive: boolean;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  subscription: Subscription;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  taskAssigned: boolean;
  taskCompleted: boolean;
  projectUpdates: boolean;
  teamMessages: boolean;
  weeklyReports: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'team' | 'private';
  showOnlineStatus: boolean;
  showActivityHistory: boolean;
  allowDirectMessages: boolean;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  status: 'active' | 'archived' | 'completed';
  visibility: 'public' | 'private';
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  tags: string[];
  settings: ProjectSettings;
}

export interface ProjectSettings {
  allowGuestAccess: boolean;
  requireApprovalForTasks: boolean;
  enableTimeTracking: boolean;
  enableChat: boolean;
  defaultTaskPriority: Task['priority'];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assigneeIds: string[];
  reporterId: string;
  status: TaskStatus;
  priority: Priority;
  type: TaskType;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  dependencies: string[];
  subtasks: Task[];
  customFields: Record<string, any>;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'task' | 'bug' | 'feature' | 'epic' | 'story';

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  taskId?: string;
  projectId?: string;
  parentCommentId?: string;
  mentions: string[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedById: string;
  uploadedAt: Date;
}

export interface TimeEntry {
  id: string;
  userId: string;
  taskId?: string;
  projectId: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  billable: boolean;
  hourlyRate?: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  projectId?: string;
  memberIds: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: ChatMessage;
  unreadCounts: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  mentions: string[];
  attachments: Attachment[];
  reactions: MessageReaction[];
  threadId?: string;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export type NotificationType = 
  | 'task_assigned'
  | 'task_completed'
  | 'task_overdue'
  | 'project_updated'
  | 'team_message'
  | 'mention'
  | 'deadline_approaching'
  | 'system_update';

export interface Analytics {
  projectId?: string;
  userId?: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    tasksCompleted: number;
    tasksCreated: number;
    hoursTracked: number;
    productivity: number;
    teamCollaboration: number;
    budgetUtilization?: number;
    revenue?: number;
  };
  trends: TrendData[];
  forecasts: ForecastData[];
}

export interface TrendData {
  date: string;
  value: number;
  label: string;
}

export interface ForecastData {
  period: string;
  predicted: number;
  confidence: number;
  actual?: number;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  targetDate: Date;
  completedAt?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  taskIds: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  projectId?: string;
  type: 'document' | 'spreadsheet' | 'presentation' | 'whiteboard';
  ownerId: string;
  collaboratorIds: string[];
  isPublic: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  lastEditedBy: string;
  folderId?: string;
}

export interface VideoCall {
  id: string;
  title: string;
  projectId?: string;
  hostId: string;
  participantIds: string[];
  status: 'scheduled' | 'ongoing' | 'ended' | 'cancelled';
  scheduledStart: Date;
  scheduledEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  meetingUrl?: string;
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Presence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  currentTaskId?: string;
  currentProjectId?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  search?: string;
  status?: string[];
  priority?: Priority[];
  assigneeIds?: string[];
  projectIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryOptions {
  filters?: FilterOptions;
  sort?: SortOptions;
  page?: number;
  limit?: number;
}
