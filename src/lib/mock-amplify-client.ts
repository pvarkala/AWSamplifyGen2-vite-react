import { Schema } from '../amplify/data/resource';

// Mock Amplify client for TypeScript compilation
export interface MockClient {
  models: {
    Todo: {
      list: () => Promise<{ data: Schema["Todo"]["type"][] }>;
      get: (id: string) => Promise<{ data: Schema["Todo"]["type"] }>;
      create: (input: Partial<Schema["Todo"]["type"]>) => Promise<{ data: Schema["Todo"]["type"] }>;
      update: (input: Partial<Schema["Todo"]["type"]>) => Promise<{ data: Schema["Todo"]["type"] }>;
      delete: (id: string) => Promise<void>;
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
      list: () => Promise<{ data: Schema["TimeEntry"]["type"][] }>;
      create: (input: Partial<Schema["TimeEntry"]["type"]>) => Promise<{ data: Schema["TimeEntry"]["type"] }>;
      update: (input: Partial<Schema["TimeEntry"]["type"]>) => Promise<{ data: Schema["TimeEntry"]["type"] }>;
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

export const generateClient = (): MockClient => {
  return {
    models: {
      Todo: {
        list: async () => ({ data: [] }),
        get: async () => ({ data: {} as Schema["Todo"]["type"] }),
        create: async () => ({ data: {} as Schema["Todo"]["type"] }),
        update: async () => ({ data: {} as Schema["Todo"]["type"] }),
        delete: async () => {},
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
        list: async () => ({ data: [] }),
        create: async () => ({ data: {} as Schema["TimeEntry"]["type"] }),
        update: async () => ({ data: {} as Schema["TimeEntry"]["type"] }),
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
