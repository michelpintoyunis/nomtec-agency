import React from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { useContactForm } from '../../hooks/useContactForm';
import { useLanguage } from '../../context/LanguageContext';
import PhoneInput from '../common/PhoneInput';

const Contact: React.FC = () => {
    const { formData, status, handleChange, handlePhoneChange, handleSubmit } = useContactForm();
    const { t } = useLanguage();

    return (
        <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 transition-colors">
            {/* ... header ... */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">
                    <div>
                        <SectionHeader
                            subtitle={t('contact.subtitle')}
                            title={t('contact.title')}
                            description={t('contact.description')}
                            align="left"
                            className="mb-12"
                        />

                        <div className="space-y-8">
                            {/* ... contact info ... */}
                            <div className="flex items-start gap-4">
                                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm text-blue-600 border border-slate-200 dark:border-slate-800">
                                    <Mail />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Email</h4>
                                    <p className="text-slate-600 dark:text-slate-300">hola@nomtec.agency</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm text-blue-600 border border-slate-200 dark:border-slate-800">
                                    <Phone />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Teléfono</h4>
                                    <p className="text-slate-600 dark:text-slate-300">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm text-blue-600 border border-slate-200 dark:border-slate-800">
                                    <MapPin />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Oficina</h4>
                                    <p className="text-slate-600 dark:text-slate-300">Av. Creatividad 101, Piso 5<br />Ciudad de México, MX</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
                        {status === 'SUCCESS' ? (
                            <div className="absolute inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('contact.successTitle')}</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-8">{t('contact.successDesc')}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    {t('contact.btnAnother')}
                                </button>
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.formName')}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all placeholder:text-slate-400"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.formEmail')}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all placeholder:text-slate-400"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.formPhone') || 'Teléfono'}</label>
                                    <PhoneInput
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.formSubject')}</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="Presupuesto">Presupuesto Proyecto</option>
                                        <option value="Consultoria">Consultoría</option>
                                        <option value="Empleo">Trabaja con nosotros</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.formMessage')}</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all placeholder:text-slate-400"
                                    placeholder="Cuéntanos más detalles..."
                                ></textarea>
                            </div>

                            {status === 'ERROR' && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
                                    <AlertCircle size={16} />
                                    {t('contact.error')}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'SENDING'}
                                className="w-full bg-blue-700 text-white font-display font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-blue-800 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'SENDING' ? (
                                    <>
                                        <Loader2 className="animate-spin" /> {t('contact.btnSending')}
                                    </>
                                ) : (
                                    <>
                                        {t('contact.btnSend')} <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
