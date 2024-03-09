import { NextRequest } from 'next/server'
import { getAvatarByFid, getFidByUsername, getNicknameByFid, getValidateMessage } from '@/app/utils/farcasterAPI'
import { htmlResponse } from '@/app/utils/response'
import { getBuyPrice } from '@/app/utils/contract'
import { friendHtml, homeHtml, notFoundHtml, poolNotCreatedHtml } from '@/app/utils/html'

export const dynamic = 'force-dynamic' // static by default, unless reading the request

export async function GET(request: NextRequest) {
  const html = homeHtml(request.nextUrl.origin)

  return new Response(
    html,
    {
      status: 200,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8' 
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const host = request.nextUrl.origin
  const body = await new Response(request.body).json();
  const data = await getValidateMessage(body.trustedData.messageBytes)
  const frameActionBody = data.message.data.frameActionBody

  console.log('frameActionBody: ', frameActionBody)

  const username = Buffer.from(frameActionBody.inputText, 'binary').toString('base64')
  const buttonIndex = frameActionBody.buttonIndex

  const fid = await getFidByUsername(username)
  if(!fid) {
    return htmlResponse(notFoundHtml(host))
  }

  try {
    await getBuyPrice(fid, 1)
  } catch {
    return htmlResponse(poolNotCreatedHtml(host))
  }

  const avatar = await getAvatarByFid(fid)
  const encodeAvatar = Buffer.from(avatar, 'binary').toString('base64');

  const nickname = await getNicknameByFid(fid)

  return htmlResponse(friendHtml(host, encodeAvatar, username, nickname))
}
