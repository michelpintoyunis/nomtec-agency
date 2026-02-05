
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Loader, AlertCircle } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
    const { user, signInWithPassword, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Clear form when user logs in, so it's empty if they log out
    React.useEffect(() => {
        if (user) {
            setEmail('');
            setPassword('');
        }
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setError(null);

        try {
            const { error } = await signInWithPassword(email, password);
            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
            console.error(err);
        } finally {
            setAuthLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        // Render Login Form "Inline" instead of redirecting
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                    <div className="p-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Acceso Administrativo</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Ingresa tus credenciales para gestionar el contenido</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                                    placeholder="admin@nomtec.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                {authLoading ? <Loader className="animate-spin" size={20} /> : 'Iniciar Sesión'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
