import React, { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

import { navLinks } from '../data/navigation';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#home" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                Nomtec
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30 text-sm"
            >
              Iniciar Proyecto
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl">
          <div className="px-4 pt-2 pb-8 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;