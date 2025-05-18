import { NextResponse } from 'next/server'

const reviews = [
  {
    id: 1,
    productId: 1,
    user: 'Ayberk B.',
    rating: 5,
    comment: 'Great quality, fast shipping!',
    date: '2024-05-01',
  },
  {
    id: 2,
    productId: 1,
    user: 'Zeynep Y.',
    rating: 4,
    comment: 'Really helped with my immune system.',
    date: '2024-05-02',
  },
  // ...etc
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const productId = url.searchParams.get('productId')
  const filtered = productId
    ? reviews.filter(r => r.productId === Number(productId))
    : reviews
  return NextResponse.json(filtered)
}

export async function POST(request: Request) {
  // In a real API, you’d save to DB here
  return NextResponse.json({ success: true })
}
