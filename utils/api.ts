// utils/api.ts
import { useLoader } from "@/context/LoaderContext/LoaderContext"

type ApiOptions = RequestInit & {
  skipAuth?: boolean
  baseUrl?: string // Optionally override the API root (e.g. for SSR vs client)
  showLoader?: boolean
}

// Add a helper to expose the loader from context
let loader: ReturnType<typeof useLoader> | null = null
export function setLoaderContext(l: ReturnType<typeof useLoader>) {
  loader = l
}

export async function api<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth = false, baseUrl = process.env.NEXT_PUBLIC_API_BASE || "", showLoader = false } = options
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`
  try {
    if (showLoader && loader) loader.show()
    const res = await fetch(url, {
      ...options,
      credentials: skipAuth ? "same-origin" : "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData?.message || res?.statusText || "API Error")
    }
    if (res.status === 204) return {} as T
    return await res.json()
  } catch (error: any) {
    throw error
  } finally {
    if (showLoader && loader) loader.hide()
  }
}
