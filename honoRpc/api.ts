import { Hono } from "hono";

import { dbClient } from "./drizzle"
import type { Bindings } from "./bindings";
import { dbCon } from "./middleware";



export const api = new Hono<{ Bindings: Bindings }>()
.get("static", (c) => {
  const posts = [
    { title: "こんにちは", slug: "1", body: "昼からビールを飲みます"},
    { title: "こんにちは", slug: "2", body: "朝も飲んでました"},
    { title: "こんにちは", slug: "3", body: "夜まで飲みます"},
  ];
  return c.json(posts);
})

.get("orm", async (c) => {
  // middlewareを使用せずDBクライアントを作成する例
  const db = dbClient({
    host: c.env.DATABASE_HOST,
    username: c.env.DATABASE_USERNAME,
    password: c.env.DATABASE_PASSWORD,
  });
  
  const posts = await db.query.posts.findMany()
  return c.json(posts);
})

.get("concontext", dbCon, async (c) => {
  // middlewareを使用してc.varにdbクライアントを突っ込む例。
  // 楽
  const db = c.var.db;
  
  const posts = await db.query.posts.findMany()
  return c.json(posts);
});