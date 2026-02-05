import React from 'react';
import { Video, PenTool, Share2, BarChart3, Camera, Mic } from 'lucide-react';
import { Service } from '../types';

export const services: Service[] = [
    {
        id: 'video-production', // Added explicit IDs as good practice
        icon: <Video className="w-6 h-6" />,
        title: "Producción de Video",
        description: "Contenido audiovisual de alta calidad, desde Reels virales hasta documentales corporativos."
    },
    {
        id: 'social-media',
        icon: <Share2 className="w-6 h-6" />,
        title: "Social Media",
        description: "Gestión estratégica de comunidades y creación de calendarios de contenido que convierten."
    },
    {
        id: 'copywriting-seo',
        icon: <PenTool className="w-6 h-6" />,
        title: "Copywriting & SEO",
        description: "Textos persuasivos optimizados para motores de búsqueda que cuentan la historia de tu marca."
    },
    {
        id: 'photography',
        icon: <Camera className="w-6 h-6" />,
        title: "Fotografía Profesional",
        description: "Sesiones de producto, lifestyle y corporativas con dirección de arte impecable."
    },
    {
        id: 'podcasting',
        icon: <Mic className="w-6 h-6" />,
        title: "Podcasting",
        description: "Producción integral de audio, desde la grabación hasta la distribución en plataformas."
    },
    {
        id: 'analytics',
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Analítica & Estrategia",
        description: "Decisiones basadas en datos. Auditorías profundas y reportes de rendimiento."
    }
];
