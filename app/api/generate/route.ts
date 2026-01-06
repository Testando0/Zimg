import { HfInference } from '@huggingface/inference';

// Configuração crucial para o Vercel não dar timeout
export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt é necessário' }), { status: 400 });
    }

    // Chamada ao Z-Image-Turbo (Otimizado para 8-9 passos)
    const response = await hf.imageToText({ // Ou textToImage dependendo da versão da lib
        model: 'Tongyi-MAI/Z-Image-Turbo',
        inputs: prompt,
        parameters: {
            guidance_scale: 0, // Turbo não usa CFG
            num_inference_steps: 9, // Otimizado para este modelo
        }
    } as any); 
    // Nota: Se a lib @huggingface/inference estiver desatualizada, 
    // use um fetch direto para o endpoint conforme abaixo:

    /* ALT: Fetch Direto (Mais garantido para modelos novos de 2026)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Tongyi-MAI/Z-Image-Turbo",
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    */

    const blob = await response.blob();
    
    return new Response(blob, {
      headers: { 'Content-Type': 'image/png' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
