import { NextRequest } from 'next/server';
import satori from "satori";
import sharp from "sharp";
import { pngResponse } from '@/app/utils/response'
import { getBuyPrice, getBuyPriceAfterFee } from '@/app/utils/contract'
import { formatEther } from 'ethers'

export async function GET(request: NextRequest) {
  const host = request.nextUrl.origin
  const searchParams = request.nextUrl.searchParams

  const encodeAvatar = searchParams.get('encode-avatar') ?? ''
  const avatar = Buffer.from(encodeAvatar, 'base64').toString('binary');
  console.log('avatar is: ', avatar)

  const username = searchParams.get('username')
  const nickname = searchParams.get('nickname')
  const fid = searchParams.get('fid')

  console.log('fid', fid, Number(fid))

  const price = await getBuyPrice(Number(fid), 1)
  const priceAfterFee = await getBuyPriceAfterFee(Number(fid), 1)


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
      <div style={{
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        border: '1px solid grey',
        borderRadius: '5px',
        padding: '10px 50px',
        boxShadow: '2px 2px 4px grey'
      }}>
        {/* eslint-disable-next-line */}
        <img style={{
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          border: '1px solid grey',
          boxShadow: '2px 2px 4px grey',
          marginRight: '50px'
        }} src={ avatar } alt="" />
        <div style={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
        }}>
          <p style={{ fontSize: '70px' }}>{ nickname }</p>
          <p style={{ fontSize: '50px', color: 'grey' }}>@{ username }</p>
          <p style={{ fontSize: '50px', color: 'grey' }}>Buy Price { Number(formatEther(price)).toFixed(5) } ETH</p>
        </div>
      </div>
      <p style={{ fontSize: '70px' }}>
        Totally pay 
        <b style={{ color: '#c848ff' }}>{ `${ Number(formatEther(priceAfterFee)).toFixed(5)}` } ETH</b>
      </p>
      <p style={{ fontSize: '70px' }}>to get 1 Key?</p>
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
