import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      console.log("Error handler response:", error.response.data);
      
      let errorMessage = "An error occurred";

      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      switch (error.response.status) {
        case 400:
          errorMessage = errorMessage || "Bad request. Please check your input.";
          break;
        case 401:
          errorMessage = errorMessage || "Unauthorized. Please login again.";
          break;
        case 403:
          errorMessage = errorMessage || "Forbidden. You don't have permission to access this resource.";
          break;
        case 404:
          errorMessage = errorMessage || "Resource not found.";
          break;
        case 500:
          errorMessage = errorMessage || "Internal server error. Please try again later.";
          break;
        default:
          errorMessage = errorMessage || `An error occurred: ${error.response.status}`;
      }
      
      toast.error(errorMessage);
      
      return error.response.data;
    }
  } else if (error instanceof Error) {
    // Handle non-Axios errors
    toast.error(error.message || "An unexpected error occurred");
    return error.message;
  }

  // For unknown error types
  toast.error("An unexpected error occurred");
  return null;
};
