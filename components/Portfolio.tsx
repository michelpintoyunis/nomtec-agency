import React from 'react';
import { PortfolioItem } from '../types';

import { portfolioItems } from '../data/portfolio';


const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Portafolio</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Trabajos recientes</h3>
          </div>
          <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center gap-2 group">
            Ver todos los proyectos <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl cursor-pointer">
              <div className="aspect-[4/5] md:aspect-square w-full">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {item.category}
                </span>
                <h4 className="text-white text-2xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;