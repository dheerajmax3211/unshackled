import { apiFetch } from "./client";
import { CreateUserRequest, UpdateUserRequest, UserResponse } from "./types";

/**
 * Creates a new user profile in the Spring Boot backend.
 * Typically called immediately after Supabase Auth signup.
 */
export async function createUser(req: CreateUserRequest): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

/**
 * Retrieves the currently authenticated user's profile.
 */
export async function getMe(): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users/me");
}

/**
 * Retrieves a user's public profile by their username.
 */
export async function getUserByUsername(username: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${username}`);
}

/**
 * Updates the authenticated user's own profile.
 */
export async function updateMe(req: UpdateUserRequest): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(req),
  });
}

/**
 * Deletes the authenticated user's account and all associated data.
 */
export async function deleteMe(): Promise<void> {
  return apiFetch<void>("/users/me", {
    method: "DELETE",
  });
}
