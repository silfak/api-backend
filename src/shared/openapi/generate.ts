import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import * as fs from 'fs';
import { registry } from './registry.js';
import { z } from 'zod';
import { registerSchema, loginSchema, changePasswordSchema } from '../../modules/auth/auth.schema.js';
import { usersSchema } from '../../modules/users/users.schema.js';

// Register schemas
registry.register('RegisterInput', registerSchema);
registry.register('LoginInput', loginSchema);
registry.register('ChangePasswordInput', changePasswordSchema);
registry.register('UserInput', usersSchema);

// Example Response Schema
const SuccessResponse = z.object({
  status: z.string(),
  message: z.string(),
});

// Register paths for Auth
registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['auth'],
  summary: 'Register a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Success Response',
      content: {
        'application/json': {
          schema: SuccessResponse.extend({
            data: z.any()
          }),
        },
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
      content: {
        'application/json': {
          schema: loginSchema,
        },
      },
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
              user: z.any()
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
      content: {
        'application/json': {
          schema: changePasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': {
          schema: SuccessResponse,
        },
      },
    },
  },
});

// Register paths for Users
registry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['users'],
  summary: 'Get all users',
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': {
          schema: SuccessResponse.extend({
            data: z.array(z.any())
          }),
        },
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
    params: z.object({
      id: z.string()
    })
  },
  responses: {
    200: {
      description: 'Success Response',
      content: {
        'application/json': {
          schema: SuccessResponse.extend({
            data: z.any()
          }),
        },
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
