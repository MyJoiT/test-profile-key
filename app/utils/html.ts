export const homeHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/home.jpg" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:input:text" content="Enter a username" /> 
        <meta property="fc:frame:post_url" content="${ host }?next-frame=result" />
        <meta property="fc:frame:button:1" content="Find Friend" />
        <meta property="fc:frame:button:1:target" content="${ host }/find" />
      </head>

      <body>
        <h1>Test Frame from vercel Function</h1>
        <figure>
          <img width="600" src="${ host }/home.jpg" />
        </figure>
      </body>
    </html>
  `

export const friendHtml = (host: string, avatar: string, username: string, nickname: string, fid: number) => {
  const state = JSON.stringify({ fid, username, nickname })
  const stateEncoded = Buffer.from(state, 'binary').toString('base64')

  return `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/og-image?encode-avatar=${ avatar }&username=${ username }&nickname=${ nickname }&fid=${ fid }&t=${ new Date().valueOf() }" />
        <meta property="fc:frame:post_url" content="${ host }/tx" />
        <meta property="fc:frame:button:1" content="Back" />
        <meta property="fc:frame:button:2" content="Buy" />
        <meta property="fc:frame:button:2:action" content="tx" />
        <meta property="fc:frame:button:2:target" content="${ host }/tx/data" />
        <meta property="fc:frame:state" content="${ stateEncoded }" />
      </head>

      <body>
      </body>
    </html>
  `
}

export const notFoundHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/notfound.jpg" />
        <meta property="fc:frame:post_url" content="${ host }" />
        <meta property="fc:frame:button:1" content="Try again" />
        <meta property="fc:frame:button:1:target" content="${ host }/home" />
      </head>

      <body>
      </body>
    </html>
  `
export const poolNotCreatedHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/notactivate.jpg" />
        <meta property="fc:frame:post_url" content="${ host }" />
        <meta property="fc:frame:button:1" content="Try again" />
        <meta property="fc:frame:button:1:target" content="${ host }/home" />
      </head>

      <body>
      </body>
    </html>
  `

export const finishedBuyHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/buyfinished.jpg" />
        <meta property="fc:frame:button:1" content="Back" />
        <meta property="fc:frame:button:1:target" content="${ host }/home" />
        <meta property="fc:frame:button:2" content="JamFrens" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="https://www.jamfrens.so/" />
      </head>

      <body>
      </body>
    </html>
  `
