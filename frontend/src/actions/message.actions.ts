import { LIKE_MESSAGE, DISLIKE_MESSAGE } from "../lib/apiUrl";

export const updateLikeStatus = async (messageId: string, liked: boolean) => {
    const url = `${LIKE_MESSAGE(messageId)}`;
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: new URLSearchParams({
          liked: liked.toString(),
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
  const url = `${DISLIKE_MESSAGE(messageId)}`;
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: new URLSearchParams({
        disliked: disliked.toString(),
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