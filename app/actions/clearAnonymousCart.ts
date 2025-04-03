import { apiRoot } from '../lib/commercetools';

export const clearAnonymousCart = async (anonymousId: string) => {
  const projectKey = process.env.CTP_PROJECT_KEY || '';

  try {
    // First, get the current custom object to get its version
    const response = await apiRoot
      .withProjectKey({ projectKey })
      .customObjects()
      .withContainerAndKey({ container: "anonymous-carts", key: anonymousId }) // Correct method
      .get()
      .execute();

    // Then delete it using the version
    await apiRoot
      .withProjectKey({ projectKey })
      .customObjects()
      .withContainerAndKey({ container: "anonymous-carts", key: anonymousId }) // Correct method
      .delete({
        queryArgs: {
          version: response.body.version,
        },
      })
      .execute();

    return { success: true };
  } catch (error) {
    // If the object doesn't exist, that's fine
    if ((error as { statusCode?: number }).statusCode === 404) {
      return { success: true };
    }

    console.error("Error clearing anonymous cart:", error);
    throw error;
  }
};

