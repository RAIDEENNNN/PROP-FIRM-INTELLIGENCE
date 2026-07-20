export function friendlyAuthMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;

  const authError = error as Error & { code?: string; status?: number };
  console.error("FundedScope auth error", {
    name: authError.name,
    message: authError.message,
    code: authError.code,
    status: authError.status
  });
  const message = error.message.toLowerCase();

  if (message.includes("rate limit") || message.includes("too many") || message.includes("email rate limit")) {
    return "You've requested too many verification emails. Please wait a few minutes before trying again, or check the verification email we've already sent.";
  }

  if (message.includes("invalid login credentials") || message.includes("invalid credentials")) {
    return "The email or password you entered is incorrect.";
  }

  if (message.includes("already registered") || message.includes("user already registered") || message.includes("already exists")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (message.includes("email not confirmed") || message.includes("not confirmed") || message.includes("confirm your email")) {
    return "Please verify your email before signing in.";
  }

  if (message.includes("weak password") || message.includes("password should be") || message.includes("password must")) {
    return "Choose a stronger password with at least 8 characters.";
  }

  if (message.includes("signup disabled") || message.includes("signups not allowed")) {
    return "Account creation is temporarily unavailable. Please try again shortly.";
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "We couldn't reach account services. Check your connection and try again.";
  }

  return fallback;
}
