import React from 'react';
import { portfolioItems } from '../../data/portfolio';
import { useLanguage } from '../../context/LanguageContext';

const Portfolio: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="portfolio" className="py-24 bg-white dark:bg-slate-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center items-center text-center md:flex-row md:justify-between md:items-end md:text-left mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase text-sm mb-3">{t('portfolio.subtitle')}</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('portfolio.title')}</h3>
                    </div>
                    <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-2 group">
                        {t('portfolio.viewAll')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioItems.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-2xl cursor-pointer border border-slate-200 dark:border-slate-800">
                            <div className="aspect-[4/5] md:aspect-square w-full">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-8 text-center">
                                <span className="text-blue-500 text-xs font-bold font-display uppercase tracking-widest mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    {item.category}
                                </span>
                                <h4 className="text-white text-3xl font-display font-bold uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
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
