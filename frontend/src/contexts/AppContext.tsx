import React, { useContext, useState } from "react";
import Toast from "../components/Toast"; // Import the Toast component
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

// Define the type for the toast message
type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

// Define the type for the AppContext
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void; // Function to show toast messages
    isLoggedIn: boolean;
}

// Create a new context for the AppContext, initialized as undefined
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Define the AppContextProvider component
export const AppContextProvider = ({
    children, // ReactNode containing child components
}: {
    children: React.ReactNode;
}) => {
    // State to manage the current toast message
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });
    // Provide the showToast function to children via context
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage); // Set the current toast message
            },
            isLoggedIn: !isError
        }}>
            {/* Render the Toast component if there's a toast message */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(undefined)} // Close the toast when clicked
                />
            )}
            {children} {/* Render the child components */}
        </AppContext.Provider>
    );
};

// Custom hook to consume the AppContext
export const useAppContext = () => {
    const context = useContext(AppContext); // Get the AppContext from useContext hook
    return context as AppContext; // Return the context as AppContext
};