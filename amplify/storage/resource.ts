import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyTodoAppStorage',
  access: (allow) => ({
    'profile-pictures/{entity_id}': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read'])
    ],
    'attachments/{entity_id}/*': [
      allow.authenticated.to(['read', 'write']),
    ],
  }),
});
