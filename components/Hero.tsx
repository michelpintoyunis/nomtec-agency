import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-blue-50/50 rounded-bl-[100px] opacity-60"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">


            <h1 className="text-5xl lg:text-7xl font-display font-bold uppercase tracking-tight text-slate-900 leading-[1.1]">
              Creamos historias que <span className="text-blue-600">inspiran</span> y conectan.
            </h1>

            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              En Nomtec fusionamos creatividad humana con inteligencia artificial para potenciar tu marca en el mundo digital.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#ai-lab" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-full font-display font-bold uppercase tracking-wider hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-500/20 group">
                Probar Generador IA
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#portfolio" className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-display font-bold uppercase tracking-wider hover:bg-slate-50 transition-all hover:border-blue-200 group">
                <Play className="mr-2 w-4 h-4 fill-slate-700 group-hover:fill-blue-600 group-hover:text-blue-600 transition-colors" />
                Ver Reel 2024
              </a>
            </div>
          </div>

          <div className="relative lg:h-[600px] w-full flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md lg:max-w-full">
              {/* Abstract shape composition representing "Content Creation" */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl rotate-3 shadow-2xl opacity-10"></div>
              <div className="absolute inset-0 bg-white rounded-3xl -rotate-3 shadow-2xl overflow-hidden border border-slate-100">
                <img
                  src="https://picsum.photos/800/800?random=1"
                  alt="Creative Team"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Impacto Mensual</p>
                      <p className="text-3xl font-bold text-slate-900">+2.5M</p>
                    </div>
                    <div className="h-10 w-32">
                      {/* Simple bar chart visualization using divs */}
                      <div className="flex items-end justify-between h-full gap-1">
                        <div className="w-full bg-blue-200 h-[40%] rounded-t-sm"></div>
                        <div className="w-full bg-blue-300 h-[70%] rounded-t-sm"></div>
                        <div className="w-full bg-blue-400 h-[50%] rounded-t-sm"></div>
                        <div className="w-full bg-blue-500 h-[85%] rounded-t-sm"></div>
                        <div className="w-full bg-blue-600 h-[100%] rounded-t-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;