import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import type { AppRouter } from "./api";
import { appRouter } from "./api";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCContextWraper } from "./trpc";
import superJson from "superjson";
import type { Bindings } from "./bindings";

const app = new Hono<{ Bindings: Bindings }>;

app.use("/trpc/*", (c, next) => {
  return trpcServer({
    router: appRouter,
    createContext: createTRPCContextWraper(c)
  })(c, next);
});

export const rpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://127.0.0.1:8787/trpc",
    }),
  ],
  transformer: superJson
});


app.get('/hello', async (c) => {
  const res = await rpc.hello.query();
  return c.text(res);
});

app.get('/dbTest', async (c) => {
  const res = await rpc.dbTest.query();
  const { title, slug, body } = res[0];
  return c.text(`${title}, ${slug}, ${body} from dbTest`);
});

export default app;