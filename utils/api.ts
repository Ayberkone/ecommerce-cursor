// utils/api.ts

type ApiOptions = RequestInit & {
  skipAuth?: boolean
  baseUrl?: string // Optionally override the API root (e.g. for SSR vs client)
}

export async function api<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth = false, baseUrl = process.env.NEXT_PUBLIC_API_BASE || "", ...fetchOptions } = options
  // Compose final URL (can easily override for SSR, test, prod, etc.)
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`
  try {
    const res = await fetch(url, {
      ...options,
      credentials: skipAuth ? "same-origin" : "include", // Use "include" for cookies if auth, "same-origin" otherwise
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    })
    // Handle non-2xx
    if (!res.ok) {
      // Try to parse error
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData?.message || res.statusText || "API Error")
    }
    if (res.status === 204) return {} as T // No content
    return await res.json()
  } catch (error: any) {
    // Here you can add logging, Sentry, etc.
    throw error
  }
}
