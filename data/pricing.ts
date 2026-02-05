import { PricingPlan } from '../types';

export const pricingPlans: PricingPlan[] = [
    {
        name: "Impulso Digital",
        price: "$900",
        period: "/mes",
        description: "Ideal para marcas que inician su presencia digital.",
        features: [
            "12 Posteos mensuales (Diseño)",
            "Gestión de comunidad básica",
            "Copywriting creativo",
            "Reporte mensual de métricas",
            "Calendario de contenidos"
        ],
        highlight: false,
        cta: "Comenzar"
    },
    {
        name: "Escala Total",
        price: "$1,800",
        period: "/mes",
        description: "Contenido estratégico y producción audiovisual para crecer.",
        features: [
            "4 Reels/TikToks (Edición Pro)",
            "16 Posteos (Mix Formatos)",
            "Estrategia de crecimiento",
            "Gestión de anuncios (Ads)",
            "Sesión de fotos trimestral",
            "Soporte prioritario"
        ],
        highlight: true,
        cta: "Elegir Popular"
    },
    {
        name: "Empresarial",
        price: "A medida",
        period: "",
        description: "Soluciones integrales para grandes organizaciones.",
        features: [
            "Estrategia Omnicanal 360°",
            "Producción de video quincenal",
            "Equipo dedicado (PM + Creativos)",
            "Desarrollo Web & SEO",
            "Eventos y coberturas en vivo",
            "Auditorías trimestrales"
        ],
        highlight: false,
        cta: "Contactar Ventas"
    }
];
