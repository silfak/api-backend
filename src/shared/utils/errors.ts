/**
 * Base application error class.
 * All custom HTTP errors should extend this class.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Restore prototype chain broken by extending built-in Error
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}

/** 400 — The request body or parameters are invalid. */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

/** 401 — The client is not authenticated. */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthenticated') {
    super(message, 401);
  }
}

/** 403 — The client does not have permission. */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/** 404 — The requested resource was not found. */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/** 409 — A conflict with the current state of a resource. */
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/** 422 — Validation failed for the given input. */
export class ValidationError extends AppError {
  public readonly errors: { field: string; message: string }[];

  constructor(errors: { field: string; message: string }[], message = 'Validation failed') {
    super(message, 422);
    this.errors = errors;
  }
}
