import { useEffect } from "react";

// Define the props for the Toast component
type ToastProps = {
    message: string; // The message to display in the toast
    type: "SUCCESS" | "ERROR"; // The type of toast (success or error)
    onClose: () => void; // Function to be called when the toast is closed
}

// Define the Toast component
const Toast = ({ message, type, onClose }: ToastProps) => {
    // Use useEffect to set up a timer for auto-closing the toast
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); // Call the onClose function after 5000 milliseconds (5 seconds)
        }, 5000);

        // Return a cleanup function to clear the timer when the component unmounts or when onClose changes
        return () => {
            clearTimeout(timer); // Clear the timer to prevent memory leaks
        };
    }, [onClose]); // Depend on the onClose function, so the effect is re-run if it changes

    // Determine the CSS styles based on the type of toast
    const styles = type === "SUCCESS"
        ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md" // Success toast styles
        : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md"; // Error toast styles

    // Render the toast component with appropriate styles and message
    return (
        <div className={styles}>
            <div className="flex justify-center items-center">
                <span className="text-lg font-semibold">{message}</span> {/* Display the message */}
            </div>
        </div>
    );
}

export default Toast; // Export the Toast component for use in other parts of the application