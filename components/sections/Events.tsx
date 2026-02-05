
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Trophy } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import { useLanguage } from '../../context/LanguageContext';
import { Event } from '../../types';
import LiveScore from '../matches/LiveScore';

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

const Events: React.FC = () => {
    const { t } = useLanguage();
    const { events } = useEvents();

    return (
        <section id="events" className="py-24 bg-slate-50 dark:bg-slate-800/50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    subtitle={t('events.subtitle')}
                    title={t('events.title')}
                    description={t('events.description')}
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => {
                        const isLive = event.status === 'first_half' || event.status === 'second_half' || event.status === 'halftime';
                        const isEnded = event.status === 'ended';
                        const isScheduled = event.status === 'scheduled' || !event.status;

                        return (
                            <div
                                key={event.id}
                                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col"
                            >
                                {/* Header / Status */}
                                <div className={`px-4 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider ${isLive ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                                    isEnded ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                                        'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        {isLive && <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>}
                                        {isLive ? 'EN VIVO' : isEnded ? 'FINALIZADO' : 'PRÓXIMAMENTE'}
                                    </div>
                                    <div>
                                        {isLive ? <MatchTimer event={event} /> : <span>{event.time}</span>}
                                    </div>
                                </div>

                                {/* Match Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        {/* Home Team */}
                                        <div className="flex flex-col items-center gap-3 w-1/3">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 p-2 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                                                <img src={event.home_team_logo} alt={event.home_team} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-center text-slate-900 dark:text-white line-clamp-1 w-full" title={event.home_team}>
                                                {event.home_team_abbr || event.home_team}
                                            </span>
                                        </div>

                                        {/* Score / VS */}
                                        <div className="flex flex-col items-center justify-center w-1/3">
                                            {isScheduled ? (
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                                                    VS
                                                </div>
                                            ) : (
                                                <LiveScore homeScore={event.home_score || 0} awayScore={event.away_score || 0} status={event.status} />
                                            )}
                                        </div>

                                        {/* Away Team */}
                                        <div className="flex flex-col items-center gap-3 w-1/3">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 p-2 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                                                <img src={event.away_team_logo} alt={event.away_team} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-center text-slate-900 dark:text-white line-clamp-1 w-full" title={event.away_team}>
                                                {event.away_team_abbr || event.away_team}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white line-clamp-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/event/${event.id}`}
                                    className={`block text-center py-3 text-sm font-bold transition-colors ${isLive ? 'bg-red-600 hover:bg-red-700 text-white' :
                                        isEnded ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300' :
                                            'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {isLive ? 'VER DETALLES EN VIVO' : 'VER DETALLES DEL PARTIDO'}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Events;
