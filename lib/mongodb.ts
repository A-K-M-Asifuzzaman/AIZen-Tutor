import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  console.warn("MONGODB_URI not set — progress will not persist to database")
}

let clientPromise: Promise<MongoClient> | null = null

if (uri) {
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  }

  if (process.env.NODE_ENV === "development") {
    // Reuse connection across hot-reloads in dev
    const g = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }
    if (!g._mongoClientPromise) {
      g._mongoClientPromise = new MongoClient(uri, options).connect()
    }
    clientPromise = g._mongoClientPromise
  } else {
    clientPromise = new MongoClient(uri, options).connect()
  }
}

export default clientPromise
