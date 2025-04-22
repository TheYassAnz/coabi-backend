import sanitizeHtml from "sanitize-html";
import { Request, Response, NextFunction } from "express";

export const xssSanitizer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sanitize = (value: any) => {
    if (typeof value === "string") {
      return sanitizeHtml(value);
    }
    return value;
  };

  if (req.body) {
    for (const key in req.body) {
      req.body[key] = sanitize(req.body[key]);
    }
  }

  if (req.query) {
    for (const key in req.query) {
      req.query[key] = sanitize(req.query[key]);
    }
  }

  if (req.params) {
    for (const key in req.params) {
      req.params[key] = sanitize(req.params[key]);
    }
  }

  next();
};
