import {
  GOOGLE_AUTH_API,
  LOGIN_API,
  LOGOUT_API,
  REGISTER_API,
} from "../lib/apiUrl";

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await fetch(REGISTER_API, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    return {
      success: true,
      data: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(LOGIN_API, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    return {
      success: true,
      data: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
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
    const response = await fetch(LOGOUT_API, {
      method: "POST",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Logout failed",
      };
    }

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};
