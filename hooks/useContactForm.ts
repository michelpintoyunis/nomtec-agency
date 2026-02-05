import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export type FormStatus = 'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR';

export const useContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '', // Initial empty phone
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState<FormStatus>('IDLE');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (phone: string) => {
        setFormData(prev => ({
            ...prev,
            phone
        }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('SENDING');

        try {
            // 1. Guardar en Supabase
            const { error: dbError } = await supabase
                .from('contact_messages')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        subject: formData.subject,
                        message: formData.message,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (dbError) throw dbError;

            // 2. Enviar notificacion por correo con EmailJS
            if (import.meta.env.VITE_EMAILJS_SERVICE_ID && import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
                const templateParams = {
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                };

                // Enviar notificación al Admin
                const sendAdmin = emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    templateParams,
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );

                // Enviar confirmación al Usuario (Auto-reply)
                // Solo si está configurado el ID del template de auto-respuesta
                if (import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID) {
                    const sendAutoReply = emailjs.send(
                        import.meta.env.VITE_EMAILJS_SERVICE_ID,
                        import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID,
                        templateParams,
                        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                    );

                    // Esperar a que ambos se envíen (opcionalmente)
                    await Promise.all([sendAdmin, sendAutoReply]);
                } else {
                    await sendAdmin;
                }
            }

            setStatus('SUCCESS');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error al procesar el formulario:', error);
            setStatus('ERROR');
        }
    };

    return {
        formData,
        status,
        handleChange,
        handlePhoneChange,
        handleSubmit
    };
};
