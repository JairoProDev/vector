import mongoose from "mongoose";

import { env, isDev } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cache = globalThis.mongooseCache ?? {
  conn: null as typeof mongoose | null,
  promise: null as Promise<typeof mongoose> | null,
};

if (isDev) {
  globalThis.mongooseCache = cache;
}

export async function connectToDatabase() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    if (!env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not configured. Define it in your environment variables before connecting.",
      );
    }
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

