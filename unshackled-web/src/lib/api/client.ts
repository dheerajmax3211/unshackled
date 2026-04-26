import { createClient as createBrowserClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Custom error class for API-related failures.
 * Captures the status code and the response body for detailed debugging.
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Base fetch wrapper for the Unshackled Spring Boot API.
 * Automatically attaches the Supabase JWT for authentication and handles common error codes.
 * 
 * @param endpoint The API endpoint (e.g., "/habits")
 * @param options Standard fetch options
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token: string | null = null;

  // 1. Resolve authentication token (Client vs Server environment)
  if (typeof window !== "undefined") {
    // Browser environment
    const supabase = createBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token ?? null;
  } else if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server environment (Server Components, Actions, Route Handlers)
    // We use dynamic import to prevent bundling server-only code (next/headers) in the browser.
    try {
      // Use eval to prevent static analysis from failing the build during SSR
      const serverModule = await eval('import("@/lib/supabase/server")');
      const supabase = await serverModule.createClient();
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token ?? null;
    } catch (e) {
      console.warn("Failed to retrieve Supabase session on server:", e);
    }
  }

  // 2. Prepare headers
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Set default content type to JSON unless it's a FormData upload
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Execute request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 4. Global Error Handling
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || "An unexpected error occurred" };
    }

    const status = response.status;

    // Specific global handling logic
    switch (status) {
      case 401:
        console.error("[API] 401 Unauthorized: Session may have expired.");
        break;
      case 402:
        console.warn("[API] 402 Payment Required: Premium feature gated.");
        break;
      case 429:
        console.warn("[API] 429 Too Many Requests: Rate limit exceeded.");
        break;
    }

    throw new ApiError(
      errorData.message || `Error ${status}: ${response.statusText}`,
      status,
      errorData
    );
  }

  // 5. Return typed response
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
