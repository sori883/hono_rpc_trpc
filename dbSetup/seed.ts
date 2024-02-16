import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as post from "./schema";

const schema = { ...post };

const connection = connect({
  host: process.env.DATABASE_HOST!,
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
});

const db = drizzle(connection, { schema });

async function main() {
  // データがすでに存在するかもなので削除
  await db.delete(schema.posts);

  // デモデータ
  const posts = [
    { title: "こんにちは", slug: "1", body: "昼からビールを飲みます"},
    { title: "こんにちは", slug: "2", body: "朝も飲んでました"},
    { title: "こんにちは", slug: "3", body: "夜まで飲みます"},
  ];

  // インサート
  const postInsert = await db
    .insert(schema.posts)
    .values(posts);
  console.log(postInsert);
};

void main();