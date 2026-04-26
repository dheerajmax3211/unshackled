import { apiFetch } from "./client";
import { Friend, UserResponse } from "./types";

/**
 * Sends a friend request to a user by their username.
 * 
 * @param username The username of the user to add.
 * @returns A confirmation message.
 */
export async function sendFriendRequest(username: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/friends/request", {
    method: "POST",
    body: JSON.stringify({ addresseeUsername: username }),
  });
}

/**
 * Responds to an incoming friend request.
 * 
 * @param friendId The UUID of the friend record.
 * @param response "ACCEPTED" or "REJECTED".
 * @returns A confirmation message.
 */
export async function respondToRequest(
  friendId: string,
  response: "ACCEPTED" | "REJECTED"
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/friends/${friendId}/respond`, {
    method: "PUT",
    body: JSON.stringify({ response }),
  });
}

/**
 * Retrieves the list of accepted friends for the authenticated user.
 * 
 * @returns A list of friend records.
 */
export async function getFriends(): Promise<Friend[]> {
  return apiFetch<Friend[]>("/friends");
}

/**
 * Retrieves the list of pending friend requests (sent to the user).
 * 
 * @returns A list of pending friend records.
 */
export async function getPendingRequests(): Promise<Friend[]> {
  return apiFetch<Friend[]>("/friends/pending");
}

/**
 * Removes a friend or cancels a pending request.
 * 
 * @param friendId The UUID of the friend record.
 */
export async function removeFriend(friendId: string): Promise<void> {
  return apiFetch<void>(`/friends/${friendId}`, {
    method: "DELETE",
  });
}

/**
 * Searches for users by username or display name to add as friends.
 * 
 * @param query The search query string.
 * @returns A list of matching user profiles.
 */
export async function searchUsers(query: string): Promise<UserResponse[]> {
  return apiFetch<UserResponse[]>(`/friends/search?q=${encodeURIComponent(query)}`);
}
