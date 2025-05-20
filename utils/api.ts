// utils/api.ts

type ApiOptions = RequestInit & { skipAuth?: boolean }

export async function api<T = any>(url: string, options: ApiOptions = {}): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
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
