import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Contáctanos</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Empecemos a crear algo increíble</h3>
            <p className="text-slate-600 text-lg mb-12">
              ¿Listo para llevar tu contenido al siguiente nivel? Cuéntanos sobre tu proyecto y nos pondremos en contacto contigo.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm text-blue-600">
                  <Mail />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">Email</h4>
                  <p className="text-slate-600">hola@nomtec.agency</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm text-blue-600">
                  <Phone />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">Teléfono</h4>
                  <p className="text-slate-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm text-blue-600">
                  <MapPin />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">Oficina</h4>
                  <p className="text-slate-600">Av. Creatividad 101, Piso 5<br/>Ciudad de México, MX</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <input type="text" id="name" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Tu nombre" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input type="email" id="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="tu@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Asunto</label>
                <select id="subject" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>Selecciona una opción</option>
                  <option>Presupuesto Proyecto</option>
                  <option>Consultoría</option>
                  <option>Trabaja con nosotros</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Mensaje</label>
                <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Cuéntanos más detalles..."></textarea>
              </div>
              <button type="button" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;