
import { apiRoot } from "@/app/lib/commercetools"

export async function fetchAnonymousCart(anonymousId: string) {
  const projectKey = process.env.CTP_PROJECT_KEY || ""

  try {
    const response = await apiRoot
      .withProjectKey({ projectKey })
      .customObjects()
      .withContainerAndKey({ container: "anonymous-carts", key: anonymousId })
      .get()
      .execute()

    return response.body
  } catch (error: any) {
    console.error("Error fetching anonymous cart:", error)

    // If it's a NotFound error (404), return an empty cart instead of null
    if (
      error.statusCode === 404 ||
      (error.message && (error.message.includes("NotFound") || error.message.includes("URI not found")))
    ) {
      console.log(`Anonymous cart with ID ${anonymousId} not found, returning empty cart`)
      return { value: [] }
    }

    // For other errors, rethrow to be handled by the caller
    throw error
  }
}

