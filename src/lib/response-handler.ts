import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  type?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  FORBIDDEN: 'FORBIDDEN_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  BUSINESS: 'BUSINESS_ERROR',
  NETWORK: 'NETWORK_ERROR',
  SERVER: 'SERVER_ERROR',
  FILE_UPLOAD: 'FILE_UPLOAD_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
} as const;

export class ResponseHelper {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message: string = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static successWithPagination<T>(
    res: Response,
    data: T[],
    meta: { total: number; page: number; limit: number },
    message: string = 'Success',
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
    });
  }

  static validationError(res: Response, errors: Array<{ field: string; message: string }>) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      type: ERROR_TYPES.VALIDATION,
      errors,
    });
  }

  static badRequest(res: Response, message: string, type: string = ERROR_TYPES.BUSINESS) {
    return res.status(400).json({
      success: false,
      message,
      type,
    });
  }

  static notFound(res: Response, message: string = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
      type: ERROR_TYPES.NOT_FOUND,
    });
  }

  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message,
      type: ERROR_TYPES.AUTH,
    });
  }

  static forbidden(res: Response, message: string = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message,
      type: ERROR_TYPES.FORBIDDEN,
    });
  }

  static internalError(res: Response, message: string = 'Internal server error') {
    return res.status(500).json({
      success: false,
      message,
      type: ERROR_TYPES.SERVER,
    });
  }

  static fileUploadError(res: Response, message: string) {
    return res.status(400).json({
      success: false,
      message,
      type: ERROR_TYPES.FILE_UPLOAD,
    });
  }

  static networkError(res: Response, message: string = 'Network error occurred') {
    return res.status(503).json({
      success: false,
      message,
      type: ERROR_TYPES.NETWORK,
    });
  }

  static rateLimitError(res: Response, message: string = 'Too many requests') {
    return res.status(429).json({
      success: false,
      message,
      type: ERROR_TYPES.RATE_LIMIT,
    });
  }
}
