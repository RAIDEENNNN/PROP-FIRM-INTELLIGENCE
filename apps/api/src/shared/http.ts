import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
  }
}

export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

export function sendOk<ResponseData>(res: Response, data: ResponseData, statusCode = 200) {
  return res.status(statusCode).json({ ok: true, data });
}

export function notImplemented(feature: string) {
  return {
    feature,
    status: "planned",
    message: `${feature} contract is scaffolded. Connect service logic and persistence next.`
  };
}
