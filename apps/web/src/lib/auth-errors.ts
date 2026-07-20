export function friendlyAuthMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;

  const authError = error as Error & { code?: string; status?: number };
  const message = error.message.toLowerCase();
  const category = categorizeAuthError(message, authError.code, authError.status);

  console.error("FundedScope auth error", {
    name: authError.name,
    message: authError.message,
    code: authError.code,
    status: authError.status,
    category
  });

  if (category === "rate_limit") {
    return "You've requested too many verification emails. Please wait a few minutes before trying again, or check the verification email we've already sent.";
  }

  if (category === "invalid_credentials") {
    return "The email or password you entered is incorrect.";
  }

  if (category === "already_registered") {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (category === "email_not_confirmed") {
    return "Please verify your email before signing in.";
  }

  if (category === "weak_password") {
    return "Choose a stronger password with at least 8 characters.";
  }

  if (category === "signup_disabled") {
    return "Account creation is temporarily unavailable. Please try again shortly.";
  }

  if (category === "smtp_failure") {
    return "Your account details were accepted, but the verification email could not be sent. Please try again shortly while we check email delivery.";
  }

  if (category === "configuration") {
    return "Account services are not configured correctly yet. Please try again shortly.";
  }

  if (category === "network") {
    return "We couldn't reach account services. Check your connection and try again.";
  }

  return fallback;
}

function categorizeAuthError(message: string, code?: string, status?: number) {
  if (message.includes("rate limit") || message.includes("too many") || message.includes("email rate limit")) return "rate_limit";
  if (message.includes("invalid login credentials") || message.includes("invalid credentials")) return "invalid_credentials";
  if (message.includes("already registered") || message.includes("user already registered") || message.includes("already exists")) return "already_registered";
  if (message.includes("email not confirmed") || message.includes("not confirmed") || message.includes("confirm your email")) return "email_not_confirmed";
  if (message.includes("weak password") || message.includes("password should be") || message.includes("password must")) return "weak_password";
  if (message.includes("signup disabled") || message.includes("signups not allowed")) return "signup_disabled";
  if (message.includes("smtp") || message.includes("email provider") || message.includes("confirmation email") || message.includes("sending email")) return "smtp_failure";
  if (message.includes("invalid api key") || message.includes("project not found") || message.includes("supabase browser auth is not configured") || status === 401 || status === 403) return "configuration";
  if (message.includes("network") || message.includes("fetch") || code === "NETWORK_ERROR") return "network";
  return "unknown";
}
