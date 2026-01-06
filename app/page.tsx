"use client";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateImage() {
    if (!prompt) return;
    setLoading(true);
    setImage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Falha na geração");

      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    } catch (err) {
      alert("Erro ao gerar imagem. Verifique seu Token.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Z-Image Turbo Gen
        </h1>

        <div className="relative group">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva sua imagem (fidelidade total)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onKeyDown={(e) => e.key === "Enter" && generateImage()}
          />
          <button 
            onClick={generateImage}
            disabled={loading}
            className="absolute right-2 top-2 p-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>

        <div className="aspect-square w-full bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-800 flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt="Gerada por IA" className="w-full h-full object-cover" />
          ) : (
            <p className="text-zinc-500">Aguardando seu prompt...</p>
          )}
        </div>
      </div>
    </main>
  );
}
