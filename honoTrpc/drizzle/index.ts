import type { Config } from "@planetscale/database";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";

import * as post from "./schema";
export const schema = { ...post };

// DBClient
export type DBClientType = PlanetScaleDatabase<typeof schema>;
export const dbClient = (config: Config) => (drizzle(connect({
  ...config,
  fetch: (url, init) => {
    delete (init!).cache;
    return fetch(url, init);
  }}),
 { schema }
 ));