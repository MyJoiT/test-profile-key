import { NextRequest } from 'next/server';
import satori from "satori";
import sharp from "sharp";
import { pngResponse } from '@/app/utils/response'

export async function GET(request: NextRequest) {
  const host = request.nextUrl.origin
  const searchParams = request.nextUrl.searchParams

  const encodeAvatar = searchParams.get('encode-avatar') ?? ''
  const avatar = Buffer.from(encodeAvatar, 'base64').toString('binary');
  console.log('avatar is: ', avatar)

  const username = searchParams.get('username')
  const nickname = searchParams.get('nickname')

  const font = {
      fileName: 'Redaction-Regular.otf',
      cssName: 'Redaction'
  };
  const fontResponse = await fetch(`${ host }/fonts/${font.fileName}`);
  const fontData = await fontResponse.arrayBuffer();

  const svg = await satori(
    <div style={{
      width: '1200px',
      height: '628px',
      display: 'flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      backgroundColor: 'white'
    }}>
      {/* eslint-disable-next-line */}
      <img style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        border: '1px solid grey',
        boxShadow: '2px 2px 4px grey',
      }} src={ avatar } alt="" />
      <p style={{ fontSize: '70px' }}>{ nickname }</p>
      <p style={{ fontSize: '50px', color: 'grey' }}>@{ username }</p>
      <p style={{ fontSize: '90px' }}>Buy 1 this Key?</p>
    </div>
    ,
    {
      width: 1200,
      height: 628,
      fonts:[
        {
          name: font.cssName,
          data: fontData,
          weight: 400,
          style: "normal",
        }
      ]
    }
  )

  const svgBuffer = Buffer.from(svg)
  const png = sharp(svgBuffer).png()
  const responseBuffer = await png.toBuffer()

  return new Response(responseBuffer,
    {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000'
      }
    }
  )
}
