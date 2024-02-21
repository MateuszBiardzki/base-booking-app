import { RegisterFormData } from "./pages/Register"; // Import the RegisterFormData type from the Register file
import { SignInFormData } from "./pages/SignIn";

// Retrieve the API base URL from environment variables using Vite's import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Define an asynchronous function named register that takes formData of type RegisterFormData as input
export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // Parse the response body as JSON
  const responseBody = await response.json();

  // Check if the response status is not ok (i.e., an error occurred)
  if (!response.ok) {
    // Throw an error with the message from the response body
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData)=>{
  const response = await fetch (`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message)
  }
  return body
};


export const validateToken = async ()=>{
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include"
  })
  if(!response.ok) {
    throw new Error ("Token invalid");
  }
  return response.json();
}
export const signOut = async ()=>{
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};