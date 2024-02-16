import { RegisterFormData } from "./pages/Register"; // Import the RegisterFormData type from the Register file

// Retrieve the API base URL from environment variables using Vite's import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define an asynchronous function named register that takes formData of type RegisterFormData as input
export const register = async (formData: RegisterFormData) => {
  // Send a POST request to the API endpoint for user registration
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST', // Specify the HTTP method as POST
    headers: {
      "Content-Type": "application/json" // Set the Content-Type header to application/json
    },
    body: JSON.stringify(formData), // Convert the formData object to JSON string and include it in the request body
  });

  // Parse the response body as JSON
  const responseBody = await response.json();

  // Check if the response status is not ok (i.e., an error occurred)
  if (!response.ok) {
    // Throw an error with the message from the response body
    throw new Error(responseBody.message);
  }
};