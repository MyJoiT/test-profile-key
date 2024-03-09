import { NextRequest } from 'next/server'
import { getAvatarByFid, getFidByUsername, getNicknameByFid } from '@/app/utils/farcasterAPI'
import { htmlResponse } from '@/app/utils/response'
import { getBuyPrice } from '@/app/utils/contract'

export const dynamic = 'force-dynamic' // static by default, unless reading the request

const homeHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/home.jpg" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:input:text" content="Enter a username" /> 
        <meta property="fc:frame:post_url" content="${ host }?next-frame=result" />
        <meta property="fc:frame:button:1" content="Find Friend" />
        <meta property="fc:frame:button:2" content="Buy" />
        <meta property="fc:frame:button:2:action" content="tx" />
        <meta property="fc:frame:button:2:target" content="${ host }/tx" />
      </head>

      <body>
        <h1>Test Frame from vercel Function</h1>
        <figure>
          <img width="600" src="${ host }/home.jpg" />
        </figure>
      </body>
    </html>
  `

const friendHtml = (host: string, avatar: string, username: string, nickname: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/og-image?encode-avatar=${ avatar }t=${ new Date().valueOf() }" />
        <meta property="fc:frame:post_url" content="${ host }?next-frame=home" />
        <meta property="fc:frame:button:1" content="Back" />
      </head>

      <body>
      </body>
    </html>
  `

const notFoundHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/notfound.jpg" />
        <meta property="fc:frame:post_url" content="${ host }?next-frame=home" />
        <meta property="fc:frame:button:1" content="Try again" />
      </head>

      <body>
      </body>
    </html>
  `
const poolNotCreatedHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/notactivate.jpg" />
        <meta property="fc:frame:post_url" content="${ host }?next-frame=home" />
        <meta property="fc:frame:button:1" content="Try again" />
      </head>

      <body>
      </body>
    </html>
  `

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

  console.log('non-tx full data is: ', body)

  console.log('non-tx untrustedData is: ', body.untrustedData)

  const username = body.untrustedData.inputText

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

  let html = null

  const searchParams = request.nextUrl.searchParams

  const nextFrame = searchParams.get('next-frame')

  if(nextFrame === 'home') {
    return htmlResponse(homeHtml(host))
  }

  return htmlResponse(friendHtml(host, encodeAvatar, username, nickname))
}
