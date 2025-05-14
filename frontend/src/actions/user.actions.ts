import axios from "axios";
import { GET_USER_PROFILE } from "../lib/apiUrl";

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(GET_USER_PROFILE, {
      withCredentials: true,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Network error",
      };
    } else {
      return {
        success: false,
        error: "An unknown error occurred",
      };
    }
  }
};
