'use client'
import React, { useState, useEffect } from 'react';
import { ClientBuilder, type Client } from '@commercetools/ts-client';
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from '@commercetools/platform-sdk';
import createCustomer from './createCustomer';
// pages/products.tsx (or your page file)
import ProductList from './productList'; // Import the component



const BASE_URI = 'https://api.europe-west1.gcp.commercetools.com';
const OAUTH_URI = 'https://auth.europe-west1.gcp.commercetools.com';
const PROJECT_KEY = 'my_test_project';
const CREDENTIALS = {
  clientId: 'hVgJUmzMBgPKayHEQzxr7dUw',
  clientSecret: 'gk3Dtx2i70rG8f0glc7bZTzfYQa-Oz3S',
};

export default function Home() {
  const [projectDetails, setProjectDetails] = useState({});
   
  // Create client
  const getClient = (): Client => {
    return new ClientBuilder()
      .defaultClient(BASE_URI, CREDENTIALS, OAUTH_URI, PROJECT_KEY)
      .build();
  };

  // Get apiRoot
  const getApiRoot = (client: Client): ApiRoot => {
    return createApiBuilderFromCtpClient(client);
  };

  useEffect(function () {
    const client = getClient();
    const apiRoot = getApiRoot(client);

    createCustomer().then(({ body }) => {
      console.log(body.customer.id);
    }).catch(console.error);

    apiRoot
      .withProjectKey({ projectKey: PROJECT_KEY })
      .get()
      .execute()
      .then(({ body }) => {
        setProjectDetails(body);
      })
      .catch(console.error);
      
  }, []);

 

  return (
    <div className='flex flex-col items-center'>
      <h2>Project details for {PROJECT_KEY}:</h2>
      <pre>{JSON.stringify(projectDetails, null, 2)}</pre>
      
      <ProductList />
      
    </div>
  );
}
