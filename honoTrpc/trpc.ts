import { dbClient } from "./drizzle";
import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Context } from "hono";
import superJson from "superjson";
import { ZodError } from "zod";

import type { Bindings } from "./bindings";

/**
 * 1. コンテキスト作成
 */
export const createTRPCContextWraper = (c: Context<{Bindings: Bindings;}>) => {
  const createTRPCContext = (
    { req, resHeaders }: FetchCreateContextFnOptions
    ) => {
    // DBClientはContextに入れる
    const db = dbClient({
      host: c.env.DATABASE_HOST,
      username: c.env.DATABASE_USERNAME,
      password: c.env.DATABASE_PASSWORD,
    });

    // .dev.varsに定義されている環境変数も
    // hono経由で取得する
    const env = c.env

    return {
      db,
      env,
      req,
      resHeaders,
    };
  };

  return createTRPCContext;
};

// createTRPCContextWraperの返り値の型をcreateTRPCContextの型とする
type createTRPCContextType = ReturnType<typeof createTRPCContextWraper>

/**
 * 2. 初期化
 *
 * ここで、コンテキストの型を指定する。
 * また、superjsonが使用出来るようtransformerに指定する
 */
const t = initTRPC.context<createTRPCContextType>().create({
  transformer: superJson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;