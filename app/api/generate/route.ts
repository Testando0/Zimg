// routes/api/generate.ts
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt } = body;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/Tongyi-MAI/Z-Image-Turbo",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: { guidance_scale: 0, num_inference_steps: 9 }
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Falha na API de Imagem');
  }

  const blob = await response.blob();
  return blob;
});
