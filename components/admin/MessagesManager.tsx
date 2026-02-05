
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader, Mail, Phone, Calendar, Search, MessageSquare, Trash2, RefreshCw } from 'lucide-react';

interface ContactMessage {
    id: number;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const MessagesManager: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setFetchError(null);
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching messages:', error);
                setFetchError(error.message);
            } else {
                setMessages(data || []);
            }
        } catch (error: any) {
            console.error('Error:', error);
            setFetchError(error.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) return;

        try {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMessages(prev => prev.filter(msg => msg.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Error al eliminar el mensaje');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="text-blue-500" />
                    Mensajes Recibidos ({messages.length})
                    <button
                        onClick={fetchMessages}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full ml-2 text-slate-500 transition-colors"
                        title="Actualizar lista"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </h2>

                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            {fetchError && (
                <div className="p-4 m-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <div className="font-bold">Error:</div> {fetchError}
                </div>
            )}

            {loading ? (
                <div className="p-12 flex justify-center">
                    <Loader className="animate-spin text-blue-600" size={32} />
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                    {searchTerm ? 'No se encontraron mensajes con esa búsqueda.' : 'No hay mensajes recibidos aún.'}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold">Usuario</th>
                                <th className="p-4 font-semibold">Asunto</th>
                                <th className="p-4 font-semibold">Mensaje</th>
                                <th className="p-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredMessages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {formatDate(msg.created_at)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{msg.name}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            <Mail size={12} /> {msg.email}
                                        </div>
                                        {msg.phone && (
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Phone size={12} /> {msg.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                            {msg.subject}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2" title={msg.message}>
                                            {msg.message}
                                        </p>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Eliminar mensaje"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MessagesManager;
