async function setupFetch() {
  const module = await import('node-fetch');
  return module.default;
}

const handler = async (event) => { 
  const fetch = await setupFetch();
  try {
    const body = JSON.parse(event.body);  
    const summary = body.summary;
    const extras = body.extras
    const API_KEY = process.env.API_KEY;
    const API_HOST = 'omniinfer.p.rapidapi.com';
    const input = {
      "negative_prompt": "nsfw, nudity, sexual content, intimate apparel, suggestive poses, explicit, adult themes, watermark, facial distortion, lip deformity, redundant background, extra fingers, Abnormal eyesight, ((multiple faces)), ((Tongue protruding)), ((extra arm)), extra hands, extra fingers, deformity, missing legs, missing toes, missin hand, missin fingers, (painting by bad-artist-anime:0.9), (painting by bad-artist:0.9), watermark, text, error, blurry, jpeg artifacts, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, artist name, (worst quality, low quality:1.4), bad anatomy",
      "sampler_name": "Euler a",
      "batch_size": 1,
      "n_iter": 1,
      "steps": 20,
      "cfg_scale": 7,
      "seed": -1,
      "height": 750,
      "width": 750,
      "model_name": "RealVisXL_V3.0.safetensors",
      "prompt": "Realistic image of " + summary + ". Keywords: " + extras
    }

    const response = await fetch('https://omniinfer.p.rapidapi.com/v2/txt2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const task_id = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ task_id })
    };

  } catch (error) {
    return { statusCode: 500, body: error.toString() }; 
  }
};

module.exports = { handler };