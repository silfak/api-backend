import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import * as fs from 'fs';
import { registry } from './registry.js';
import { z } from 'zod';
import { registerSchema, loginSchema, changePasswordSchema } from '../../modules/auth/auth.schema.js';
import { usersSchema, userListItemSchema, userByIdSchema, userUpdateSchema } from '../../modules/users/users.schema.js';
import { createBuildingSchema, updateBuildingSchema, buildingSchema } from '../../modules/buildings/buildings.schema.js';
import { createRoomSchema, updateRoomSchema, roomSchema } from '../../modules/rooms/rooms.schema.js';

// Register schemas
registry.register('RegisterInput', registerSchema);
registry.register('LoginInput', loginSchema);
registry.register('ChangePasswordInput', changePasswordSchema);

registry.register('UserInput', usersSchema);
registry.register('UserUpdateInput', userUpdateSchema);
registry.register('UserListItem', userListItemSchema);
registry.register('UserById', userByIdSchema);

registry.register('CreateBuildingInput', createBuildingSchema);
registry.register('UpdateBuildingInput', updateBuildingSchema);
registry.register('Building', buildingSchema);

registry.register('CreateRoomInput', createRoomSchema);
registry.register('UpdateRoomInput', updateRoomSchema);
registry.register('Room', roomSchema);

// Example Response Schema
const SuccessResponse = z.object({
  status: z.string(),
  message: z.string(),
});

// --- Auth Routes ---
registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['auth'],
  summary: 'Register a new user',
  request: {
    body: {
      content: { 'application/json': { schema: registerSchema } },
    },
  },
  responses: {
    201: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['auth'],
  summary: 'Login user',
  request: {
    body: {
      content: { 'application/json': { schema: loginSchema } },
    },
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': {
          schema: SuccessResponse.extend({
            data: z.object({
              token: z.string(),
              user: userByIdSchema
            })
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/auth/change-password',
  tags: ['auth'],
  summary: 'Change password',
  request: {
    body: {
      content: { 'application/json': { schema: changePasswordSchema } },
    },
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse },
      },
    },
  },
});

// --- Users Routes ---
registry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['users'],
  summary: 'Get all users',
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: z.array(userListItemSchema) }) },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/users/OB',
  tags: ['users'],
  summary: 'Create OB User',
  request: {
    body: {
      content: { 'application/json': { schema: usersSchema } },
    },
  },
  responses: {
    201: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['users'],
  summary: 'Get user by id',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/users/{id}',
  tags: ['users'],
  summary: 'Update user',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { 'application/json': { schema: userUpdateSchema } },
    },
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/users/{id}/status',
  tags: ['users'],
  summary: 'Update user status',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
  },
});

// --- Buildings Routes ---
registry.registerPath({
  method: 'get',
  path: '/buildings',
  tags: ['buildings'],
  summary: 'Get all buildings',
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: z.array(buildingSchema) }) },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/buildings/{id}',
  tags: ['buildings'],
  summary: 'Get building by id',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: buildingSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/buildings',
  tags: ['buildings'],
  summary: 'Create building',
  request: {
    body: {
      content: { 'application/json': { schema: createBuildingSchema } },
    },
  },
  responses: {
    201: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: buildingSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/buildings/{id}',
  tags: ['buildings'],
  summary: 'Update building',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { 'application/json': { schema: updateBuildingSchema } },
    },
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: buildingSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/buildings/{id}',
  tags: ['buildings'],
  summary: 'Delete building',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse },
      },
    },
  },
});

// --- Rooms Routes ---
registry.registerPath({
  method: 'get',
  path: '/rooms',
  tags: ['rooms'],
  summary: 'Get all rooms',
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: z.array(roomSchema) }) },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/rooms/{id}',
  tags: ['rooms'],
  summary: 'Get room by id',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: roomSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/rooms',
  tags: ['rooms'],
  summary: 'Create room',
  request: {
    body: {
      content: { 'application/json': { schema: createRoomSchema } },
    },
  },
  responses: {
    201: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: roomSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/rooms/{id}',
  tags: ['rooms'],
  summary: 'Update room',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { 'application/json': { schema: updateRoomSchema } },
    },
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: roomSchema }) },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/rooms/{id}',
  tags: ['rooms'],
  summary: 'Delete room',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': { schema: SuccessResponse },
      },
    },
  },
});


const generator = new OpenApiGeneratorV3(registry.definitions);

const document = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'SILFAK API',
    description: 'API documentation generated from Zod schemas',
  },
  servers: [{ url: 'http://localhost:8000/api' }],
});

fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2), {
  encoding: 'utf-8',
});

console.log('OpenAPI specification generated at ./openapi.json');
