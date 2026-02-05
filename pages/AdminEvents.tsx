
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ExternalLink, Calendar, MessageSquare, LayoutDashboard, Menu, X, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventsManager from '../components/admin/EventsManager';
import MessagesManager from '../components/admin/MessagesManager';
import StatusManager from '../components/admin/StatusManager';
import UsersManager from '../components/admin/UsersManager';

const AdminEvents: React.FC = () => {
    const { signOut, user } = useAuth();
    const [activeTab, setActiveTab] = useState<'events' | 'messages' | 'status' | 'users'>('events');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const getHeaderContent = () => {
        switch (activeTab) {
            case 'events':
                return {
                    title: 'Gestión de Eventos',
                    desc: 'Crea, edita y elimina los eventos próximos.'
                };
            case 'messages':
                return {
                    title: 'Mensajes de Contacto',
                    desc: 'Revisa las consultas enviadas desde el sitio web.'
                };
            case 'status':
                return {
                    title: 'Estado de Eventos',
                    desc: 'Controla qué eventos están "En Vivo" actualmente.'
                };
            case 'users':
                return {
                    title: 'Gestión de Usuarios',
                    desc: 'Registra nuevos administradores con nombre y teléfono.'
                };
        }
    };

    const headerContent = getHeaderContent();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
                            <LayoutDashboard className="text-blue-600" />
                            <span>Admin Panel</span>
                        </div>
                        <button onClick={toggleSidebar} className="lg:hidden text-slate-500">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <button
                            onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'events'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            <Calendar size={20} />
                            Eventos
                        </button>
                        <button
                            onClick={() => { setActiveTab('status'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'status'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            <Activity size={20} />
                            Estados
                        </button>
                        <button
                            onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'messages'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            <MessageSquare size={20} />
                            Formulario
                        </button>
                        <button
                            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'users'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            <LayoutDashboard size={20} />
                            Usuarios
                        </button>
                    </nav>

                    {/* User Info & Footer */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'A').toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {user?.user_metadata?.full_name || user?.email}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Link
                                to="/"
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <ExternalLink size={16} />
                                Ir a la web
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-30">
                    <button onClick={toggleSidebar} className="p-2 text-slate-600 dark:text-slate-300">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-slate-900 dark:text-white">Admin Panel</span>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </header>

                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {headerContent.title}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            {headerContent.desc}
                        </p>
                    </header>

                    {activeTab === 'events' && <EventsManager />}
                    {activeTab === 'messages' && <MessagesManager />}
                    {activeTab === 'status' && <StatusManager />}
                    {activeTab === 'users' && <UsersManager />}
                </div>
            </main>
        </div>
    );
};

export default AdminEvents;
