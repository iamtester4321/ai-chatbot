import axios from "axios";
import {
  GOOGLE_AUTH_API,
  LOGIN_API,
  LOGOUT_API,
  REGISTER_API,
} from "../lib/apiUrl";

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(REGISTER_API, {
      email,
      password,
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      success: response.status === 201,
      data: response.data.user,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response?.data?.message || "Network error. Please try again later.";

      if (error.response?.data?.message === "User already exists") {
        return {
          success: false,
          message: "User already exists",
        };
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};



export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(LOGIN_API, {
      email,
      password,
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    }

    return {
      success: true,
      data: response.data.user,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response?.data?.message || "Network error. Please try again later.",
      };
    } else {
      return {
        success: false,
        message: "Network error. Please try again later.",
      };
    }
  }
};


export const googleAuth = () => {
  try {
    window.location.href = GOOGLE_AUTH_API;
  } catch (error) {
    return {
      success: false,
      message: "Failed to initiate Google authentication",
    };
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(LOGOUT_API, {}, {
      withCredentials: true,
    });
    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Logout failed",
      };
    }

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response?.data?.message || "Network error. Please try again later.",
      };
    } else {
      return {
        success: false,
        message: "Network error. Please try again later.",
      };
    }
  }
};
