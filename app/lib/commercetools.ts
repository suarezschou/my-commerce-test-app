import { ClientBuilder } from "@commercetools/sdk-client-v2"
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk"

// Server-side environment variables access
const PROJECT_KEY = process.env.CTP_PROJECT_KEY || ""
const CLIENT_ID = process.env.CTP_CLIENT_ID || ""
const CLIENT_SECRET = process.env.CTP_CLIENT_SECRET || ""
const AUTH_URL = process.env.CTP_AUTH_URL || ""
const API_URL = process.env.CTP_API_URL || ""
const SCOPES = (process.env.CTP_SCOPES || "").split(" ")


try {
  if (!PROJECT_KEY || !CLIENT_ID || !CLIENT_SECRET || !AUTH_URL || !API_URL || !SCOPES) {
    throw new Error("Missing required Commercetools environment variables");
  }
} catch (error) {
    console.error("Commercetools client initialization error:", error);
    throw error; // Re-throw the error to stop the application
}

// Create the Commercetools client
const ctpClient = new ClientBuilder()
  .withProjectKey(PROJECT_KEY)
  .withClientCredentialsFlow({
    host: AUTH_URL,
    projectKey: PROJECT_KEY,
    credentials: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    },
    scopes: SCOPES,
    fetch,
  })
  .withHttpMiddleware({
    host: API_URL,
    fetch,
  })
  .withLoggerMiddleware()
  .build()

  

// Create the API root object
  export const apiRoot = createApiBuilderFromCtpClient(ctpClient);

