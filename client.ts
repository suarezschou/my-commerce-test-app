import { ctpClient } from './app/apiClientConfig';
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient)
  .withProjectKey({ projectKey: '{my_test_project}' });

// Example call to return Project information
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.
const  getEndPoint = () => {
  return apiRoot
  .shoppingLists()
  .withId({ ID: 'a-shoppinglist-id' })
  .get()
  .execute()
  .then(({ body }) => {
    console.log(JSON.stringify(body));
  })    
.catch(console.error)   
};
