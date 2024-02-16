import { mysqlTable } from "drizzle-orm/mysql-core";
import {
  serial,
  text,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const posts = mysqlTable(
  "posts",
  {
    id: serial("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    body: text("body"),
  },
  (t) => ({
    unqName: unique().on(t.slug),
  }),
);
