// app/api/generate/route.ts
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt é necessário' }), { status: 400 });
    }

    // Chamada direta via Fetch para evitar erros de tipagem da biblioteca HF
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
            parameters: {
                guidance_scale: 0,
                num_inference_steps: 9
            }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Erro na API: ${errorText}` }), { status: response.status });
    }

    // Aqui o .blob() funciona perfeitamente pois a 'response' vem do fetch nativo
    const blob = await response.blob();
    
    return new Response(blob, {
      headers: { 
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable' 
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
