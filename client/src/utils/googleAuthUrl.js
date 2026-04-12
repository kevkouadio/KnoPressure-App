/**
 * Google OAuth must start with a full browser navigation to the API.
 * CRA's dev proxy does not forward full page navigations (Accept: text/html),
 * so the client must hit the API origin directly in development.
 *
 * Override port/host with REACT_APP_API_ORIGIN (e.g. http://localhost:3001).
 */
export default function googleAuthStartUrl() {
  if (process.env.NODE_ENV === "development") {
    const origin =
      process.env.REACT_APP_API_ORIGIN || "http://localhost:3001";
    return `${origin.replace(/\/$/, "")}/api/auth/google`;
  }
  return "/api/auth/google";
}
