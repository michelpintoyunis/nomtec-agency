import React, { useState } from 'react';
import { Menu, X, Zap, Sun, Moon, Globe } from 'lucide-react';
import { useScroll } from '../../hooks/useScroll';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isScrolled = useScroll();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'es' ? 'en' : 'es');
    };

    const navLinks = [
        { name: t('nav.home'), href: '#home' },
        { name: t('nav.services'), href: '#services' },
        { name: t('nav.portfolio'), href: '#portfolio' },
        { name: t('nav.events'), href: '#events' },
        { name: t('nav.contact'), href: '#contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="#home" className="flex items-center gap-2 group">
                            <img
                                src="/nomtec-logo.png"
                                alt="Nomtec"
                                className={`h-12 w-auto object-contain transition-all ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
                            />
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-display font-bold uppercase tracking-wider text-sm transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors font-bold font-display text-sm"
                            title="Switch Language"
                        >
                            <Globe size={18} />
                            <span>{language.toUpperCase()}</span>
                        </button>

                        <a
                            href="#contact"
                            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-display font-bold uppercase tracking-wide transition-all text-sm ml-4"
                        >
                            {t('nav.startProject')}
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-900 dark:text-white hover:text-blue-600 focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xl">
                    <div className="px-4 pt-2 pb-8 space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-base font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
                            <button
                                onClick={() => { toggleLanguage(); setIsOpen(false); }}
                                className="w-full text-left px-3 py-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-base font-medium flex items-center gap-2"
                            >
                                <Globe size={18} />
                                <span>Cambiar a {language === 'es' ? 'Inglés' : 'Español'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
