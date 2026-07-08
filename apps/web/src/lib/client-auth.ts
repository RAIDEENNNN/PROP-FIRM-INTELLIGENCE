export type AuthPayload = {
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
  accessToken?: string;
  refreshToken?: string;
};

export function saveAuth(payload: AuthPayload) {
  if (typeof window === "undefined") return;
  if (payload.accessToken) window.localStorage.setItem("fundedscope_access_token", payload.accessToken);
  if (payload.refreshToken) window.localStorage.setItem("fundedscope_refresh_token", payload.refreshToken);
  if (payload.user) window.localStorage.setItem("fundedscope_user", JSON.stringify(payload.user));
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("fundedscope_access_token");
}
