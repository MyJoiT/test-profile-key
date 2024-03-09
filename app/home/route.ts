import { NextRequest } from 'next/server'
import { homeHtml } from '@/app/utils/html'
import { htmlResponse } from '@/app/utils/response'

export async function POST(request: NextRequest) {
  const host = request.nextUrl.origin
  return htmlResponse(homeHtml(host))
}
