// Placeholder schema for TypeScript compilation
export interface Schema {
  Todo: {
    type: {
      id: string;
      title: string;
      content?: string;
      status: string;
      priority: string;
      tags: string[];
      category?: string;
      estimatedHours?: number;
      dueDate?: string;
      assigneeId?: string;
      comments?: string[];
      isDone?: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
  User: {
    type: {
      id: string;
      email: string;
      username?: string;
      bio?: string;
      isPublic?: boolean;
      commentsEnabled?: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
  ChatMessage: {
    type: {
      id: string;
      content: string;
      userId: string;
      channelId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  VideoCall: {
    type: {
      id: string;
      title: string;
      participants: string[];
      createdAt: string;
      updatedAt: string;
    };
  };
  TimeEntry: {
    type: {
      id: string;
      description: string;
      duration: number;
      userId: string;
      projectId?: string;
      isBillable?: boolean;
      hourlyRate?: number;
      createdAt: string;
      updatedAt: string;
    };
  };
  Project: {
    type: {
      id: string;
      name: string;
      description?: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  Milestone: {
    type: {
      id: string;
      title: string;
      description?: string;
      dueDate?: string;
      projectId: string;
      isCompleted?: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}
