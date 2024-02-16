import { dbClient } from "./drizzle";
import type { DBClientType } from "./drizzle";
import type { MiddlewareHandler } from "hono";

import type { Bindings } from "./bindings";

// 環境変数で定義したDB接続情報を元に
// dbClientを作成するミドルウェア
export const dbCon: MiddlewareHandler<{
  Bindings: Bindings;
  Variables: {
    db: DBClientType
  }
}> = async (c, next) => {
  c.set("db", dbClient({
    host: c.env.DATABASE_HOST,
    username: c.env.DATABASE_USERNAME,
    password: c.env.DATABASE_PASSWORD,
    // 以下のエラーに対応したもの
    // The 'cache' field on 'RequestInitializerDict' is not implemented.
    // see: https://github.com/planetscale/database-js/pull/102#issuecomment-1508219636
  }));
  await next();
};