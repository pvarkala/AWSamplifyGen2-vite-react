import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      username: a.string(),
      email: a.string(),
      bio: a.string(),
      profilePicture: a.url(),
      isPublic: a.boolean().default(false),
      commentsEnabled: a.boolean().default(true),
      timezone: a.string(),
      calendarConnected: a.boolean().default(false),
      calendarProvider: a.enum(['google', 'outlook']),
      calendarAccessToken: a.string(),
      isOnline: a.boolean().default(false),
      lastSeen: a.datetime(),
      preferences: a.json(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean().default(false),
      priority: a.enum(['low', 'medium', 'high']),
      dueDate: a.datetime(),
      category: a.string(),
      tags: a.string().array(),
      owner: a.id(),
      projectId: a.id(),
      assigneeId: a.id(),
      estimatedHours: a.float(),
      actualHours: a.float(),
      milestoneId: a.id(),
      status: a.enum(['todo', 'in_progress', 'review', 'done']),
      position: a.integer(),
      timeEntries: a.json().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ])
    .identifier(['owner']),
    
  Project: a
    .model({
      name: a.string(),
      description: a.string(),
      color: a.string(),
      owner: a.id(),
      isPublic: a.boolean().default(false),
      members: a.id().array(),
      status: a.enum(['planning', 'active', 'on_hold', 'completed']),
      startDate: a.datetime(),
      endDate: a.datetime(),
      budget: a.float(),
      actualCost: a.float(),
      kanbanColumns: a.json().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  Comment: a
    .model({
      content: a.string(),
      authorId: a.id(),
      todoId: a.id(),
      userId: a.id(),
      projectId: a.id(),
      mentions: a.id().array(),
      attachments: a.json().array(),
      isEdited: a.boolean().default(false),
      editedAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  Attachment: a
    .model({
      filename: a.string(),
      url: a.url(),
      todoId: a.id(),
      projectId: a.id(),
      uploadedBy: a.id(),
      fileSize: a.integer(),
      mimeType: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  Milestone: a
    .model({
      title: a.string(),
      description: a.string(),
      projectId: a.id(),
      dueDate: a.datetime(),
      isCompleted: a.boolean().default(false),
      progress: a.integer().default(0),
      createdBy: a.id(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  TimeEntry: a
    .model({
      description: a.string(),
      userId: a.id(),
      todoId: a.id(),
      projectId: a.id(),
      startTime: a.datetime(),
      endTime: a.datetime(),
      duration: a.float(),
      isBillable: a.boolean().default(false),
      hourlyRate: a.float(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  ChatMessage: a
    .model({
      content: a.string(),
      authorId: a.id(),
      projectId: a.id(),
      channelId: a.id(),
      mentions: a.id().array(),
      attachments: a.json().array(),
      messageType: a.enum(['text', 'file', 'system']),
      isEdited: a.boolean().default(false),
      editedAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  Notification: a
    .model({
      title: a.string(),
      message: a.string(),
      userId: a.id(),
      type: a.enum(['mention', 'comment', 'task_assigned', 'task_completed', 'project_invite']),
      isRead: a.boolean().default(false),
      actionUrl: a.string(),
      metadata: a.json(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  Document: a
    .model({
      title: a.string(),
      content: a.string(),
      projectId: a.id(),
      authorId: a.id(),
      collaborators: a.id().array(),
      version: a.integer().default(1),
      isPublic: a.boolean().default(false),
      lastEditedBy: a.id(),
      lastEditedAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
    
  VideoCall: a
    .model({
      title: a.string(),
      projectId: a.id(),
      hostId: a.id(),
      participants: a.id().array(),
      scheduledTime: a.datetime(),
      duration: a.integer(),
      meetingUrl: a.string(),
      recordingUrl: a.string(),
      status: a.enum(['scheduled', 'ongoing', 'ended']),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
