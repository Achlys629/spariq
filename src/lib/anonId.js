import { v4 as uuidv4 } from "uuid";

const KEY = "sparIQ-anon-id";

/**
 * Returns the anonymous user ID from localStorage.
 * Generates and persists a new UUID on first call.
 * Returns null during SSR (server-side rendering).
 */
export function getAnonId() {
  if (typeof window === "undefined") return null;

  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(KEY, id);
  }
  return id;
}
