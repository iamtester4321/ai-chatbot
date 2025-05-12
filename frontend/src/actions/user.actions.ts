import { GET_USER_PROFILE } from "../lib/apiUrl";

export const fetchUserProfile = async () => {
  try {
    const response = await fetch(GET_USER_PROFILE, {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to fetch user profile",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error",
    };
  }
};
