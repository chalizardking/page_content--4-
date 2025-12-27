import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import db from "@/lib/db";

export interface Context {
  db: typeof db;
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  } | null;
}

export const createContext = async (): Promise<Context> => {
  // For now, return a mock session - will be replaced with real auth later
  return {
    db,
    session: null,
  };
};

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
