
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserPlus, Mail, Lock, Phone, User, Check, AlertCircle, Loader } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Create a temporary client to create users without logging out the admin
// We use the same URL and Key from the main instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const UsersManager: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Validate inputs
            if (formData.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres.');
            }

            // 1. Create a non-persistent client to avoid overwriting the current admin session
            const tempClient = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    persistSession: false, // Critical: Don't store this session
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            });

            // 2. Sign up the new user
            const { data, error } = await tempClient.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                setMessage({
                    type: 'success',
                    text: `Usuario "${formData.fullName}" creado exitosamente. ${data.session ? 'Sesión iniciada (virtualmente).' : 'Se ha enviado un correo de confirmación.'}`
                });

                // Clear form
                setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    password: ''
                });
            }

        } catch (error: any) {
            console.error('Error creating user:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Error al crear el usuario.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                            Crear Nuevo Usuario
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Registra un nuevo administrador o editor con acceso al panel.
                        </p>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                        }`}>
                        {message.type === 'success' ? <Check size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                        <p className="font-medium text-sm">{message.text}</p>
                    </div>
                )}

                <form onSubmit={handleCreateUser} className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nombre Completo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Teléfono</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="+58 412 123 4567"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="usuario@nomtec.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : <UserPlus size={20} />}
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsersManager;
