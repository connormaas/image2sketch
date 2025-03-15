import * as base64 from "https://deno.land/std@0.183.0/encoding/base64.ts";

export default async (request) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: headers
    });
  }

  try {

    const API_KEY = Deno.env.get("API_KEY");
    const API_HOST = 'open-ai21.p.rapidapi.com';

    const res = await request.text()
    const body = JSON.parse(res)
    const imageBase64Prefix = body.image;
    const imageBase64 = imageBase64Prefix.split(',')[1];
    
    const decodedBytes = base64.decode(imageBase64);
    const blob = new Blob([decodedBytes], { type: 'image/png' });

    const data = new FormData();
    data.append('file', blob, "image.png");

    const info = {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: data
    }

    const response = await fetch('https://open-ai21.p.rapidapi.com/imagecaptioning', info)

    const textResponse = await response.text()
    return new Response(textResponse, { 
      status: 200, 
      headers: headers
    })

  } catch (error) {
    const errorText = await error.text()
    return new Response(errorText, { 
      status: 500,
      headers: headers
    });
  }
};

export const config = { path: "/test" };
