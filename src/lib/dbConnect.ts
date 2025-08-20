import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable.");
}

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    // allow global caching across hot-reloads in development
    var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis._mongooseCache ?? (globalThis._mongooseCache = { conn: null, promise: null });

/**
 * Connects to MongoDB using mongoose and caches the connection
 * so repeated imports/hot-reloads don't create new connections.
 */
export default async function dbConnect(): Promise<typeof mongoose> {
    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        // mongoose v6+ doesn't require useNewUrlParser/useUnifiedTopology explicitly,
        // but options can be supplied if desired.
        mongoose.set("strictQuery", false);
        cache.promise = mongoose.connect(MONGODB_URI!).then((m) => {
            cache.conn = m;
            return m;
        });
    }

    return cache.promise;
}