import React from 'react';
import { services } from '../../data/services';
import SectionHeader from '../common/SectionHeader';
import { useLanguage } from '../../context/LanguageContext';

const Services: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="services" className="py-24 bg-slate-50 dark:bg-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    subtitle={t('services.subtitle')}
                    title={t('services.title')}
                    description={t('services.description')}
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {service.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
