import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client"; // Import API client functions
import { useAppContext } from "../contexts/AppContext"; // Import AppContext to show toasts
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function Register() {
    const queryClient = useQueryClient();
    const navigate = useNavigate(); // Get the navigation function from react-router-dom
    const { showToast } = useAppContext(); // Get the showToast function from AppContext to show toasts
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors } } = useForm<RegisterFormData>(); // Initialize form using useForm hook

    // Use useMutation hook to handle registration mutation
    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => { // Callback function called on successful registration
            showToast({ message: "Registration Success!", type: "SUCCESS" }); // Show success toast
            await queryClient.invalidateQueries("validateToken");
            navigate("/"); // Navigate to home page
        },
        onError: (error: Error) => { // Callback function called on registration error
            showToast({ message: error.message, type: "ERROR" }); // Show error toast with error message
        },
    });

    // Function called on form submission
    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data); // Call the mutation to register user with form data
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}> {/* Form with onSubmit handler */}
            <h2 className="text-3xl font-bold">Create an Account</h2>
            {/* Input fields for first name and last name */}
            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                        {...register("firstName", { required: "This field is required" })} ></input>
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                        {...register("lastName", { required: "This field is required" })}></input>
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>
            {/* Input field for email */}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input type="email" className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", { required: "This field is required" })}></input>
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            {/* Input field for password */}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password",
                        {
                            required: "This field is required",
                            minLength: { value: 6, message: "password must be at least 6 characters" }
                        })}></input>
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            {/* Input field for confirming password */}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Confirm Password
                <input type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                        validate: (val) => {
                            if (!val) {
                                return "This field is required"
                            } else if (watch("password") != val) {
                                return "Your password do not match";
                            }
                        }
                    })}></input>
                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}
            </label>
            {/* Submit button */}
            <span>
                <button type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                    Create Account
                </button>
            </span>
        </form>
    )
}

export default Register;