async function setupFetch() {
  const module = await import('node-fetch');
  return module.default;
}

const handler = async (event) => {
  const fetch = await setupFetch();
  try {
    const task_id = event.queryStringParameters.task_id;
    const API_KEY = process.env.API_KEY;
    const API_HOST = 'omniinfer.p.rapidapi.com';

    const imageResponse = await fetch(`https://omniinfer.p.rapidapi.com/v2/progress?task_id=${task_id}`, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });

    if (!imageResponse.ok) {
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