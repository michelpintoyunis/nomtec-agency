import React from 'react';
import { Zap, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-white">Nomtec</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Agencia de creación de contenido líder impulsada por creatividad humana e inteligencia artificial.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Servicios</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Producción de Video</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Social Media</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Branding</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Estrategia Digital</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Compañía</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm mb-4">Suscríbete para recibir tendencias digitales y consejos.</p>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-slate-800 border-none rounded-l-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-blue-500 outline-none" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">OK</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Nomtec Agency. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;