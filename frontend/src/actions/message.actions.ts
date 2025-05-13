import { LIKE_MESSAGE, DISLIKE_MESSAGE } from "../lib/apiUrl";

export const updateLikeStatus = async (messageId: string, liked: boolean) => {
    try {
      const response = await fetch(`${LIKE_MESSAGE(messageId)}`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          liked: liked,
        }),
      });
    
      const result = await response.json();
    
      if (response.ok) {
        console.log("Message reaction updated successfully:", result);
        return result;
      } else {
        console.error("Failed to update message reaction:", result);
        return null;
      }
    } catch (error) {
      console.error("Error updating message reaction:", error);
      return null;
    }
  };

export const updateDislikeStatus = async (messageId: string, disliked: boolean) => {
  
  try {
    const response = await fetch(`${DISLIKE_MESSAGE(messageId)}`, {
      method: 'PATCH',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        disliked: disliked,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Message reaction updated successfully:", result);
      return result;
    } else {
      console.error("Failed to update message reaction:", result);
      return null;
    }
  } catch (error) {
    console.error("Error updating message reaction:", error);
    return null;
  }
};