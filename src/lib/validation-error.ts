/* eslint-disable @typescript-eslint/no-explicit-any */
import { SafeParseReturnType, ZodIssue } from 'zod';

export const formatValidationError = (parsed: SafeParseReturnType<any, any>) => {
  if (parsed.success) return null;

  const errors = parsed.error.errors.map((err: ZodIssue) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return errors;
};
