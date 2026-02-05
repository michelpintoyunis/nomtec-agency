import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { generateContentIdeas } from '../services/geminiService';
import { GeneratedIdea, LoadingState } from '../types';

const IdeaGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStatus(LoadingState.LOADING);
    setIdeas([]);
    
    try {
      const result = await generateContentIdeas(topic, platform);
      setIdeas(result);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="ai-lab" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Nomtec AI Lab
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              ¿Sin inspiración? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Déjanos ayudarte.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Utiliza nuestra herramienta potenciada por Gemini 3 Flash para generar ideas de contenido instantáneas y creativas para tu marca.
            </p>

            <form onSubmit={handleGenerate} className="space-y-6 bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
                  ¿Sobre qué quieres hablar?
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej. Moda sostenible, Café de especialidad, Marketing B2B..."
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Plataforma</label>
                <div className="flex gap-4">
                  {['Instagram', 'LinkedIn', 'TikTok', 'Blog'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        platform === p 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === LoadingState.LOADING || !topic}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === LoadingState.LOADING ? (
                  <>
                    <Loader2 className="animate-spin" /> Generando Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Generar con IA
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-4">
             {status === LoadingState.IDLE && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-2xl p-12 min-h-[400px]">
                    <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-center">Tus ideas aparecerán aquí.</p>
                </div>
             )}

             {status === LoadingState.ERROR && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-6 rounded-xl">
                    Algo salió mal. Por favor, intenta de nuevo.
                </div>
             )}

             {status === LoadingState.SUCCESS && (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Check className="text-green-400" /> Resultados para {platform}
                  </h3>
                  {ideas.map((idea, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors group relative">
                        <button 
                            onClick={() => copyToClipboard(`${idea.title}\n${idea.description}`, idx)}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/20 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            title="Copiar idea"
                        >
                            {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        <h4 className="text-lg font-bold text-blue-300 mb-2">{idea.title}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{idea.description}</p>
                    </div>
                  ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdeaGenerator;