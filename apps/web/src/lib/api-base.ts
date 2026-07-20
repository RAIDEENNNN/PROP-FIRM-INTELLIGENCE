export function getServerApiBase() {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "").replace(/\/$/, "");
}
