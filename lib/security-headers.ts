export function getSecurityHeaders() {
  // Define CSP directives
  const contentSecurityPolicy = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://js.stripe.com"],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "https://res.cloudinary.com", "https://cdn.jsdelivr.net"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": ["'self'", "https://api.stripe.com", process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL || ""],
    "frame-src": ["'self'", "https://js.stripe.com"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'"],
    "upgrade-insecure-requests": [],
  }

  // Convert CSP object to string
  const cspString = Object.entries(contentSecurityPolicy)
    .map(([key, values]) => {
      if (values.length === 0) return key
      return `${key} ${values.join(" ")}`
    })
    .join("; ")

  return {
    "Content-Security-Policy": cspString,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  }
}
