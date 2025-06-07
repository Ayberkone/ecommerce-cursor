// utils/reviewsApi.ts

import { api } from "@/utils/api" // Or your own API helper

export interface Review {
  _id: string
  product: string
  user: { firstName: string; lastName: string; _id: string }
  rating: number
  comment: string
  createdAt: string
}

export async function fetchReviews(productId: string): Promise<Review[]> {
  return await api<Review[]>(`/api/reviews?productId=${productId}`)
}

export async function addReview({ productId, rating, comment }: { productId: string; rating: number; comment: string }): Promise<Review> {
  return await api<Review>(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify({ productId, rating, comment })
  })
}

export async function updateReview(id: string, { rating, comment }: { rating?: number; comment?: string }) {
  return await api<Review>(`/api/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify({ rating, comment })
  })
}

export async function deleteReview(id: string) {
  return await api<{ message: string }>(`/api/reviews/${id}`, {
    method: "DELETE"
  })
}
export async function fetchUserReviews(userId: string): Promise<Review[]> {
  return await api<Review[]>(`/api/reviews/user/${userId}`)
}
