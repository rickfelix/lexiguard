import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema";

const COOKIE_NAME = "lg_uid";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export async function anonymousUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const existing = req.cookies?.[COOKIE_NAME] as string | undefined;

    if (existing) {
      const [row] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, existing))
        .limit(1);
      if (row) {
        req.userId = row.id;
        return next();
      }
    }

    const [created] = await db.insert(users).values({}).returning();
    req.userId = created.id;
    res.cookie(COOKIE_NAME, created.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_MS,
      path: "/",
    });
    next();
  } catch (err) {
    console.error("[anonymousUser] failed:", err);
    next(err);
  }
}
