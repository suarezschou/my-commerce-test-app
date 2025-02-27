export default async function createCustomer() {
  const customerData = {
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
  }

  const response = await fetch("/api/commercetools", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "createCustomer",
      data: customerData,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create customer")
  }

  return response.json()
}

