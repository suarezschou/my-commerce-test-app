import { Customer } from '@commercetools/platform-sdk';
import { apiRoot } from './apiClientConfig';

const createCustomer = (): Promise<{ body: { customer: Customer } }> => {
  return apiRoot
    .withProjectKey({ projectKey: 'my_test_project' })
    .customers()
    .post({
      body: {
        email: 'newcustomer@example.com',
        password: 'examplePassword',
      },
    })
    .execute();
};

export default createCustomer;
