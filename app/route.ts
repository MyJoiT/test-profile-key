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
