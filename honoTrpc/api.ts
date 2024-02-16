import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `Hello ${input ?? "World"}!`;
  }),

  dbTest: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.posts.findMany();
  }),
});

export type AppRouter = typeof appRouter