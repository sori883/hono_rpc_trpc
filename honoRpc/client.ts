import { Hono } from "hono";
import { api } from "./api";
import { hc } from "hono/client";

const app = new Hono();

const route = app.route("/api", api);
type AppType = typeof route;

const rpc = hc<AppType>("http://127.0.0.1:8787");

app.get('/static', async (c) => {
  const res = await rpc.api.static.$get();
  const { title, slug, body } = (await res.json())[0];
  return c.text(`${title}, ${slug}, ${body} from static`);
});

app.get('/orm', async (c) => {
  const res = await rpc.api.orm.$get();
  const { title, slug, body } = (await res.json())[0];
  return c.text(`${title}, ${slug}, ${body} from orm`);
});

app.get('/concontext', async (c) => {
  const res = await rpc.api.concontext.$get();
  const { title, slug, body } = (await res.json())[0];
  return c.text(`${title}, ${slug}, ${body} from orm`);
});

export default app;