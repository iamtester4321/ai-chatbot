import axios from "axios";
import { DISLIKE_MESSAGE, LIKE_MESSAGE } from "../lib/apiUrl";

export const updateLikeStatus = async (messageId: string, liked: boolean) => {
  try {
    const response = await axios.patch(
      `${LIKE_MESSAGE(messageId)}`,
      { liked: liked },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error updating message reaction:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unknown error occurred:", error);
    }
    return null;
  }
};

export const updateDislikeStatus = async (
  messageId: string,
  disliked: boolean
) => {
  try {
    const response = await axios.patch(
      `${DISLIKE_MESSAGE(messageId)}`,
      { disliked: disliked },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error updating message reaction:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unknown error occurred:", error);
    }
    return null;
  }
};
