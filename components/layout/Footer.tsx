import React from 'react';
import { Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-slate-900 text-slate-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div>
                        <div className="mb-6">
                            <img src="/nomtec-logo.png" alt="Nomtec" className="h-10 w-auto brightness-0 invert" />
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            {t('footer.description')}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">{t('footer.links')}</h4>
                        <ul className="space-y-3">
                            <li><a href="#home" className="hover:text-blue-400 transition-colors">{t('nav.home')}</a></li>
                            <li><a href="#services" className="hover:text-blue-400 transition-colors">{t('nav.services')}</a></li>
                            <li><a href="#portfolio" className="hover:text-blue-400 transition-colors">{t('nav.portfolio')}</a></li>
                            <li><a href="#ai-lab" className="hover:text-blue-400 transition-colors">AI Lab</a></li>
                            <li><a href="#contact" className="hover:text-blue-400 transition-colors">{t('nav.contact')}</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">{t('footer.services')}</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Estrategia Digital</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Content Marketing</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Producción Audiovisual</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Social Ads</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Diseño Web</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">{t('footer.contact')}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
                                <span>Av. Innovación 123, Piso 4<br />Ciudad Creativa, CP 2024</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-blue-500 shrink-0" size={18} />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-blue-500 shrink-0" size={18} />
                                <span>hola@nomtec.agency</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} Nomtec Agency. {t('footer.rights')}</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
