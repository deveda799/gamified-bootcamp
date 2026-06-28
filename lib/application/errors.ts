export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE_TYPE"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(
    code: AppErrorCode,
    message: string,
    cause?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.cause = cause;
  }
}
