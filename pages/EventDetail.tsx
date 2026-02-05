
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Event } from '../types';
import { ArrowLeft, Calendar, Clock, MapPin, Trophy, Shield } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LiveScore from '../components/matches/LiveScore';

const MatchTimer = ({ event }: { event: Event }) => {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        const calculateTime = () => {
            if (!event.match_start_timestamp || (event.status !== 'first_half' && event.status !== 'second_half')) {
                if (event.status === 'halftime') setElapsed('HT');
                else if (event.status === 'ended') setElapsed('FT');
                else setElapsed('');
                return;
            }

            const now = Date.now();
            const start = event.match_start_timestamp;
            const diffMinutes = Math.floor((now - start) / 60000);

            if (event.status === 'first_half') {
                if (diffMinutes > 45) {
                    setElapsed(`45+${diffMinutes - 45}'`);
                } else {
                    setElapsed(`${diffMinutes}'`);
                }
            } else if (event.status === 'second_half') {
                const totalMinutes = 45 + diffMinutes;
                if (totalMinutes > 90) {
                    setElapsed(`90+${totalMinutes - 90}'`);
                } else {
                    setElapsed(`${totalMinutes}'`);
                }
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 10000);
        return () => clearInterval(interval);
    }, [event.status, event.match_start_timestamp]);

    return <span>{elapsed}</span>;
};

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { events, loading } = useEvents();
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        if (id && events.length > 0) {
            const foundEvent = events.find(e => e.id.toString() === id);
            if (foundEvent) {
                setEvent(foundEvent);
            }
        }
    }, [id, events]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-slate-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Partido no encontrado</h2>
                <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>
            </div>
        );
    }

    const isMatch = !!event.home_team;
    const isLive = event.status === 'first_half' || event.status === 'second_half' || event.status === 'halftime';

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors font-sans">
            <Navbar />

            <main className="pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <Link to="/#events" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                        <ArrowLeft size={20} />
                        Volver a Partidos
                    </Link>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700">
                        {/* Hero / Header with Match Score */}
                        <div className="relative bg-slate-900 text-white p-8 md:p-12 overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <img src={event.image} className="w-full h-full object-cover grayscale" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                                {/* Home Team */}
                                <div className="flex flex-col items-center gap-4 flex-1">
                                    <img src={event.home_team_logo} alt={event.home_team} className="w-24 h-24 md:w-32 md:h-32 object-contain bg-white/10 rounded-full p-4 backdrop-blur-sm" />
                                    <div className="text-center">
                                        <h2 className="text-xl md:text-3xl font-bold leading-tight">{event.home_team}</h2>
                                    </div>
                                </div>

                                {/* Scoreboard */}
                                <div className="flex flex-col items-center justify-center min-w-[200px]">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center w-full">
                                        {isMatch ? (
                                            <>
                                                <div className="mb-2 flex items-center justify-center transform scale-150 origin-center py-4">
                                                    <LiveScore homeScore={event.home_score || 0} awayScore={event.away_score || 0} status={event.status} />
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${isLive ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                                    {isLive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                                                    {isLive ? <MatchTimer event={event} /> : (event.status === 'ended' ? 'FINAL' : 'VS')}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-2xl font-bold uppercase tracking-widest">{event.category}</div>
                                        )}
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-slate-300 text-sm font-medium">
                                        <Calendar size={14} /> {event.date} • <Clock size={14} /> {event.time}
                                    </div>
                                </div>

                                {/* Away Team */}
                                <div className="flex flex-col items-center gap-4 flex-1">
                                    <img src={event.away_team_logo} alt={event.away_team} className="w-24 h-24 md:w-32 md:h-32 object-contain bg-white/10 rounded-full p-4 backdrop-blur-sm" />
                                    <div className="text-center">
                                        <h2 className="text-xl md:text-3xl font-bold leading-tight">{event.away_team}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-12">
                                {/* Main Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                                        <Shield className="text-blue-500" />
                                        Detalles del Partido
                                    </h3>

                                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {event.description || 'No hay descripción disponible para este encuentro.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Sidebar Info */}
                                <div className="w-full md:w-80 space-y-6">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Información</h4>
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-3 text-sm">
                                                <MapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
                                                <div>
                                                    <span className="block font-medium text-slate-900 dark:text-white">Estadio</span>
                                                    <span className="text-slate-500 dark:text-slate-400">{event.location}</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3 text-sm">
                                                <Trophy className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                                <div>
                                                    <span className="block font-medium text-slate-900 dark:text-white">Competición</span>
                                                    <span className="text-slate-500 dark:text-slate-400">{event.category}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventDetail;
