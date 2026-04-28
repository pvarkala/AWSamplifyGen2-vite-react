import { Schema } from '../amplify/data/resource';

// Mock Amplify client for TypeScript compilation
export interface MockClient {
  models: {
    Todo: {
      list: (input?: any) => Promise<{ data: Schema["Todo"]["type"][] }>;
      get: (id: string) => Promise<{ data: Schema["Todo"]["type"] }>;
      create: (input: Partial<Schema["Todo"]["type"]>) => Promise<{ data: Schema["Todo"]["type"] }>;
      update: (input: Partial<Schema["Todo"]["type"]>) => Promise<{ data: Schema["Todo"]["type"] }>;
      delete: (input?: any) => Promise<void>;
    };
    User: {
      list: (input?: any) => Promise<{ data: Schema["User"]["type"][] }>;
      get: (id: string) => Promise<{ data: Schema["User"]["type"] }>;
      create: (input: Partial<Schema["User"]["type"]>) => Promise<{ data: Schema["User"]["type"] }>;
      update: (input: Partial<Schema["User"]["type"]>) => Promise<{ data: Schema["User"]["type"] }>;
    };
    ChatMessage: {
      list: () => Promise<{ data: Schema["ChatMessage"]["type"][] }>;
      create: (input: Partial<Schema["ChatMessage"]["type"]>) => Promise<{ data: Schema["ChatMessage"]["type"] }>;
    };
    VideoCall: {
      list: () => Promise<{ data: Schema["VideoCall"]["type"][] }>;
      create: (input: Partial<Schema["VideoCall"]["type"]>) => Promise<{ data: Schema["VideoCall"]["type"] }>;
    };
    TimeEntry: {
      list: (input?: any) => Promise<{ data: Schema["TimeEntry"]["type"][] }>;
      create: (input: Partial<Schema["TimeEntry"]["type"]>) => Promise<{ data: Schema["TimeEntry"]["type"] }>;
      update: (input: Partial<Schema["TimeEntry"]["type"]>) => Promise<{ data: Schema["TimeEntry"]["type"] }>;
      delete: (input?: any) => Promise<void>;
    };
    Project: {
      list: () => Promise<{ data: Schema["Project"]["type"][] }>;
      create: (input: Partial<Schema["Project"]["type"]>) => Promise<{ data: Schema["Project"]["type"] }>;
    };
    Milestone: {
      list: () => Promise<{ data: Schema["Milestone"]["type"][] }>;
      create: (input: Partial<Schema["Milestone"]["type"]>) => Promise<{ data: Schema["Milestone"]["type"] }>;
    };
  };
}

export const generateClient = (): any => {
  return {
    models: {
      Todo: {
        list: async (input?: any) => ({ data: [] }),
        get: async () => ({ data: {} as Schema["Todo"]["type"] }),
        create: async () => ({ data: {} as Schema["Todo"]["type"] }),
        update: async () => ({ data: {} as Schema["Todo"]["type"] }),
        delete: async (input?: any) => {},
      },
      User: {
        list: async () => ({ data: [] }),
        get: async () => ({ data: {} as Schema["User"]["type"] }),
        create: async () => ({ data: {} as Schema["User"]["type"] }),
        update: async () => ({ data: {} as Schema["User"]["type"] }),
      },
      ChatMessage: {
        list: async () => ({ data: [] }),
        create: async () => ({ data: {} as Schema["ChatMessage"]["type"] }),
      },
      VideoCall: {
        list: async () => ({ data: [] }),
        create: async () => ({ data: {} as Schema["VideoCall"]["type"] }),
      },
      TimeEntry: {
        list: async (input?: any) => ({ data: [] }),
        create: async () => ({ data: {} as Schema["TimeEntry"]["type"] }),
        update: async () => ({ data: {} as Schema["TimeEntry"]["type"] }),
        delete: async (input?: any) => {},
      },
      Project: {
        list: async () => ({ data: [] }),
        create: async () => ({ data: {} as Schema["Project"]["type"] }),
      },
      Milestone: {
        list: async () => ({ data: [] }),
        create: async () => ({ data: {} as Schema["Milestone"]["type"] }),
      },
    },
  };
};
