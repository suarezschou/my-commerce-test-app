import fetch from 'node-fetch';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'my_test_project', // Use your actual project key
  credentials: {
    clientId: "hVgJUmzMBgPKayHEQzxr7dUw", // Use your actual client ID
    clientSecret: "gk3Dtx2i70rG8f0glc7bZTzfYQa-Oz3S", // Use your actual client secret
  },
  scopes: [
    'manage_project:my_test_project',
    'manage_customers:my_test_project:b2c-retail-store',
    'manage_orders:my_test_project:b2c-retail-store',
    'manage_shopping_lists:my_test_project:b2c-retail-store',
  ],
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

// Create the Commercetools client
export const ctpClient = new ClientBuilder()
  .withProjectKey('my_test_project') // Use your actual project key here as well
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

// Create the API builder
export const apiRoot = createApiBuilderFromCtpClient(ctpClient);