export const htmlResponse = (html: string) => {
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

export const pngResponse = (buffer: Buffer) => {
  return new Response(buffer,
    {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000'
      }
    }
  )
}

export const jsonResponse = (data: string) => {
  return new Response(
    data, 
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json' 
      },
    }
  );
}
