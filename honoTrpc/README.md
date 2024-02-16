# honoTrpc
気合のコンテキスト作成。
superjson使えるのはやっぱり楽

```
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
```