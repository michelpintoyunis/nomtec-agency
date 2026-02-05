import React from 'react';
import { Check, Star } from 'lucide-react';

import { pricingPlans as plans } from '../data/pricing';


const Pricing: React.FC = () => {
  return (
    <section id="planes" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Nuestros Planes</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Inversión clara, resultados reales</h3>
          <p className="text-slate-600 text-lg">
            Elige el plan que mejor se adapte a la etapa actual de tu negocio. Sin costos ocultos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl transition-all duration-300 ${plan.highlight
                  ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10 border border-slate-800'
                  : 'bg-white text-slate-900 border border-slate-200 hover:shadow-xl hover:-translate-y-1'
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Star size={12} fill="currentColor" /> Recomendado
                </div>
              )}

              <h4 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h4>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>

              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className={`text-sm ml-1 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className={`text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full py-3 px-6 rounded-xl font-bold text-center transition-all ${plan.highlight
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;