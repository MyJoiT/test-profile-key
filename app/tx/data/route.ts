import { NextRequest } from 'next/server'
import { ethers } from 'ethers'
import { htmlResponse } from '@/app/utils/response'
import { getValidateMessage } from '@/app/utils/farcasterAPI'
import { homeHtml, notFoundHtml } from '@/app/utils/html'

export const dynamic = 'force-dynamic' // static by default, unless reading the request

export async function POST(request: NextRequest) {
  const host = request.nextUrl.origin
  const body = await new Response(request.body).json();
  const data = await getValidateMessage(body.trustedData.messageBytes)
  const frameActionBody = data.message.data.frameActionBody

  console.log('tx frameActionBody: ', frameActionBody)

  const buttonIndex = frameActionBody.buttonIndex

  if(buttonIndex === 1) {
    return htmlResponse(homeHtml(host))
  }

  return htmlResponse(notFoundHtml(host))
}
