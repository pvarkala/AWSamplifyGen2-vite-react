export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
  BLOCKED: 'blocked'
} as const

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const

export const TASK_TYPES = {
  TASK: 'task',
  BUG: 'bug',
  FEATURE: 'feature',
  EPIC: 'epic',
  STORY: 'story'
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const

export const PROJECT_STATUSES = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  COMPLETED: 'completed'
} as const

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const

export const CHAT_CHANNEL_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  DIRECT: 'direct'
} as const

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_OVERDUE: 'task_overdue',
  PROJECT_UPDATED: 'project_updated',
  TEAM_MESSAGE: 'team_message',
  MENTION: 'mention',
  DEADLINE_APPROACHING: 'deadline_approaching',
  SYSTEM_UPDATE: 'system_update'
} as const

export const ANALYTICS_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year'
} as const

export const DOCUMENT_TYPES = {
  DOCUMENT: 'document',
  SPREADSHEET: 'spreadsheet',
  PRESENTATION: 'presentation',
  WHITEBOARD: 'whiteboard'
} as const

export const VIDEO_CALL_STATUSES = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  ENDED: 'ended',
  CANCELLED: 'cancelled'
} as const

export const PRESENCE_STATUSES = {
  ONLINE: 'online',
  AWAY: 'away',
  BUSY: 'busy',
  OFFLINE: 'offline'
} as const

export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
  GRAY: '#6B7280'
} as const

export const TASK_STATUS_COLORS = {
  [TASK_STATUSES.TODO]: '#6B7280',
  [TASK_STATUSES.IN_PROGRESS]: '#3B82F6',
  [TASK_STATUSES.REVIEW]: '#F59E0B',
  [TASK_STATUSES.DONE]: '#10B981',
  [TASK_STATUSES.BLOCKED]: '#EF4444'
} as const

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: '#10B981',
  [PRIORITIES.MEDIUM]: '#F59E0B',
  [PRIORITIES.HIGH]: '#EF4444',
  [PRIORITIES.URGENT]: '#DC2626'
} as const

export const PROJECT_COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
  '#06B6D4', '#6366F1', '#EC4899', '#F97316', '#84CC16'
]
