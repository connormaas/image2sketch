async function setupFetch() {
  const module = await import('node-fetch');
  return module.default;
}

const handler = async (event) => {
  const fetch = await setupFetch();
  try {
    const API_KEY = process.env.API_KEY;
    const API_HOST = 'open-ai21.p.rapidapi.com';

    const body = JSON.parse(event.body);
    const imageBase64 = body.image;

    const buff = Buffer.from(imageBase64, 'base64');
    const image = new Blob([buff.buffer], { type: 'image/png' });

    const data = new FormData();
    data.append('file', image);

    const caption = await fetch(`https://open-ai21.p.rapidapi.com/imagecaptioning`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      },
      body: data
    });

    throw new Error(await caption.text())

    if (!caption.ok) {
      throw new Error(`Failed to check status: ${imageResponse.statusText}`);
    }

    const response = await imageResponse.text()
    const res = JSON.parse(response);
    const images = res.data.imgs

    if (images) {
      const image = images[0]
      return {
        statusCode: 200,
        body: JSON.stringify({ image })
      };
    } else {
      return {
        statusCode: 202,
        body: 'Image is still being processed.'
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler }