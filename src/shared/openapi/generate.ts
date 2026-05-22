import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import * as fs from 'fs';
import { registry } from './registry';
import { z } from 'zod';
import { registerSchema, loginSchema, changePasswordSchema } from '../../modules/auth/auth.schema';
import { usersSchema, userListItemSchema, userByIdSchema, userUpdateSchema } from '../../modules/users/users.schema';
import { createBuildingSchema, updateBuildingSchema, buildingSchema } from '../../modules/buildings/buildings.schema';
import { createRoomSchema, updateRoomSchema, roomSchema } from '../../modules/rooms/rooms.schema';
import { createReportSchema, updateReportSchema, reportSchema } from '../../modules/reports/reports.schema';
import { categoriesSchema, createCategorySchema, updateCategorySchema } from '../../modules/categories/categories.schema';

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

registry.register('CreateReportInput', createReportSchema);
registry.register('UpdateReportInput', updateReportSchema);
registry.register('Report', reportSchema);

registry.register('CreateCategoryInput', createCategorySchema);
registry.register('UpdateCategoryInput', updateCategorySchema);
registry.register('Category', categoriesSchema);

// --- Reusable Response Schemas ---

const SuccessResponse = z.object({
  success: z.boolean(),
  message: z.string(),
});

const ErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

const ValidationErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })),
});

registry.register('ErrorResponse', ErrorResponse);
registry.register('ValidationErrorResponse', ValidationErrorResponse);

// Helper for common error responses
const commonErrors = {
  401: {
    description: 'Unauthenticated — token missing or invalid',
    content: { 'application/json': { schema: ErrorResponse } },
  },
  403: {
    description: 'Forbidden — insufficient permissions',
    content: { 'application/json': { schema: ErrorResponse } },
  },
  500: {
    description: 'Internal server error',
    content: { 'application/json': { schema: ErrorResponse } },
  },
} as const;

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
      description: 'User registered successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
    409: {
      description: 'Conflict — user or NIM already exists',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Login successful',
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
    401: {
      description: 'Invalid credentials',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    500: commonErrors[500],
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
      description: 'Password changed successfully',
      content: {
        'application/json': { schema: SuccessResponse },
      },
    },
    400: {
      description: 'Bad request — passwords do not match',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Users fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: z.array(userListItemSchema) }) },
      },
    },
    ...commonErrors,
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
      description: 'OB user created successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
    404: {
      description: 'Role OB not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    409: {
      description: 'Conflict — user already exists',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'post',
  path: '/users/admin',
  tags: ['users'],
  summary: 'Create Admin User',
  request: {
    body: {
      content: { 'application/json': { schema: usersSchema } },
    },
  },
  responses: {
    201: {
      description: 'Admin user created successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
    404: {
      description: 'Role Admin not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    409: {
      description: 'Conflict — user already exists',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
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
      description: 'User fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
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
      description: 'User updated successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
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
      description: 'User status updated successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: userByIdSchema }) },
      },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Buildings fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: z.array(buildingSchema) }) },
      },
    },
    ...commonErrors,
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
      description: 'Building fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: buildingSchema }) },
      },
    },
    404: {
      description: 'Building not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Building created successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: buildingSchema }) },
      },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Building updated successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: buildingSchema }) },
      },
    },
    404: {
      description: 'Building not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Building deleted successfully',
      content: {
        'application/json': { schema: SuccessResponse },
      },
    },
    404: {
      description: 'Building not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Rooms fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: z.array(roomSchema) }) },
      },
    },
    ...commonErrors,
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
      description: 'Room fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: roomSchema }) },
      },
    },
    404: {
      description: 'Room not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Room created successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: roomSchema }) },
      },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Room updated successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: roomSchema }) },
      },
    },
    404: {
      description: 'Room not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
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
      description: 'Room deleted successfully',
      content: {
        'application/json': { schema: SuccessResponse },
      },
    },
    404: {
      description: 'Room not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
  },
});

// --- Categories Routes ---
registry.registerPath({
  method: 'get',
  path: '/categories',
  tags: ['categories'],
  summary: 'Get all categories',
  responses: {
    200: {
      description: 'Categories fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: z.array(categoriesSchema) }) },
      },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'get',
  path: '/categories/{id}',
  tags: ['categories'],
  summary: 'Get category by id',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Category fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: categoriesSchema }) },
      },
    },
    404: {
      description: 'Category not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'post',
  path: '/categories',
  tags: ['categories'],
  summary: 'Create category',
  request: {
    body: {
      content: { 'application/json': { schema: createCategorySchema } },
    },
  },
  responses: {
    201: {
      description: 'Category created successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: categoriesSchema }) },
      },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'put',
  path: '/categories/{id}',
  tags: ['categories'],
  summary: 'Update category',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { 'application/json': { schema: updateCategorySchema } },
    },
  },
  responses: {
    200: {
      description: 'Category updated successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: categoriesSchema }) },
      },
    },
    404: {
      description: 'Category not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/categories/{id}',
  tags: ['categories'],
  summary: 'Delete category',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Category deleted successfully',
      content: {
        'application/json': { schema: SuccessResponse },
      },
    },
    404: {
      description: 'Category not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
  },
});

// --- Reports Routes ---
registry.registerPath({
  method: 'get',
  path: '/reports',
  tags: ['reports'],
  summary: 'Get all reports',
  responses: {
    200: {
      description: 'Reports fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: z.array(reportSchema) }) },
      },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'get',
  path: '/reports/{id}',
  tags: ['reports'],
  summary: 'Get report by id',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Report fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: reportSchema }) },
      },
    },
    404: {
      description: 'Report not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'post',
  path: '/reports',
  tags: ['reports'],
  summary: 'Create report',
  request: {
    body: {
      content: { 'application/json': { schema: createReportSchema } },
    },
  },
  responses: {
    201: {
      description: 'Report created successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: reportSchema }) },
      },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'patch',
  path: '/reports/{id}',
  tags: ['reports'],
  summary: 'Update report',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { 'application/json': { schema: updateReportSchema } },
    },
  },
  responses: {
    200: {
      description: 'Report updated successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: reportSchema }) },
      },
    },
    404: {
      description: 'Report not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    422: {
      description: 'Validation failed',
      content: { 'application/json': { schema: ValidationErrorResponse } },
    },
    ...commonErrors,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/reports/{id}',
  tags: ['reports'],
  summary: 'Delete report',
  request: {
    params: z.object({ id: z.string() })
  },
  responses: {
    200: {
      description: 'Report deleted successfully',
      content: {
        'application/json': { schema: SuccessResponse },
      },
    },
    404: {
      description: 'Report not found',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
  },
});

// --- Dashboard Route ---
const DashboardSummarySchema = z.object({
  totalReports: z.number(),
  pendingReports: z.number(),
  resolvedReports: z.number(),
});

const CategoryTrendItemSchema = z.object({
  categoryName: z.string(),
  count: z.number(),
});

const TopRoomItemSchema = z.object({
  roomName: z.string(),
  floor: z.number(),
  buildingName: z.string(),
  count: z.number(),
});

const DashboardResponseSchema = z.object({
  summary: DashboardSummarySchema,
  categoryTrend: z.array(CategoryTrendItemSchema),
  topRooms: z.array(TopRoomItemSchema),
});

registry.register('DashboardResponse', DashboardResponseSchema);

registry.registerPath({
  method: 'get',
  path: '/reports/dashboard',
  tags: ['reports'],
  summary: 'Get dashboard analytics (summary, category trend, top rooms)',
  responses: {
    200: {
      description: 'Dashboard stats fetched successfully',
      content: {
        'application/json': { schema: SuccessResponse.extend({ data: DashboardResponseSchema }) },
      },
    },
    ...commonErrors,
  },
});

// --- CSV Export Route ---
registry.registerPath({
  method: 'get',
  path: '/reports/export/csv',
  tags: ['reports'],
  summary: 'Export reports to CSV (optional month/year filter)',
  request: {
    query: z.object({
      month: z.coerce.number().min(1).max(12).optional().openapi({ description: 'Filter by month (1-12)' }),
      year: z.coerce.number().min(2000).optional().openapi({ description: 'Filter by year (e.g. 2026)' }),
    }),
  },
  responses: {
    200: {
      description: 'CSV file download',
      content: {
        'text/csv': {
          schema: z.string().openapi({ description: 'CSV file content' }),
        },
      },
    },
    400: {
      description: 'Invalid query parameters',
      content: { 'application/json': { schema: ErrorResponse } },
    },
    ...commonErrors,
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
