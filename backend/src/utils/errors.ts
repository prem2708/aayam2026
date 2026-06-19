export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function sendError(res: import('express').Response, error: unknown) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: { message: error.message, code: error.code },
    });
  }
  console.error(error);
  return res.status(500).json({
    success: false,
    error: { message: 'Internal server error' },
  });
}
