
import React, { useState, useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { Activity, Play, Pause, Square } from 'lucide-react';
import { Event } from '../../types';

const StatusManager: React.FC = () => {
    const { events, updateEvent } = useEvents();

    const handleUpdateMatch = async (event: Event, updates: Partial<Event>) => {
        try {
            await updateEvent({
                ...event,
                ...updates
            });
        } catch (error) {
            console.error("Error updating match", error);
        }
    };

    const handlePhaseChange = (event: Event, phase: Event['status']) => {
        let updates: Partial<Event> = { status: phase };

        // When starting a half, set the timestamp to calculate minutes
        if (phase === 'first_half' || phase === 'second_half') {
            updates.match_start_timestamp = Date.now();
        }

        handleUpdateMatch(event, updates);
    };

    const handleScoreChange = (event: Event, team: 'home' | 'away', change: number) => {
        const currentScore = team === 'home' ? (event.home_score || 0) : (event.away_score || 0);
        const newScore = Math.max(0, currentScore + change);

        handleUpdateMatch(event, {
            [team === 'home' ? 'home_score' : 'away_score']: newScore
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-blue-500" />
                    Sala de Control
                </h2>
                <p className="text-slate-500 text-sm mt-1">Gestiona el marcador y el tiempo de los partidos EN VIVO.</p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {events.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No hay partidos creados.</div>
                ) : (
                    events.map((event) => (
                        <MatchControl
                            key={event.id}
                            event={event}
                            onUpdateMatch={handleUpdateMatch}
                            onScoreChange={handleScoreChange}
                            onPhaseChange={handlePhaseChange}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// Subcomponent for individual match control
const MatchControl: React.FC<{
    event: Event,
    onUpdateMatch: any,
    onScoreChange: any,
    onPhaseChange: any
}> = ({ event, onScoreChange, onPhaseChange }) => {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        const calculateTime = () => {
            if (!event.match_start_timestamp || (event.status !== 'first_half' && event.status !== 'second_half')) {
                if (event.status === 'scheduled') setElapsed('0\'');
                else if (event.status === 'halftime') setElapsed('HT');
                else if (event.status === 'ended') setElapsed('FT');
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
        const interval = setInterval(calculateTime, 10000); // 10s
        return () => clearInterval(interval);
    }, [event.status, event.match_start_timestamp]);

    return (
        <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            {/* Header: Teams & Status */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                {/* Match Info */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-center">
                    <div className="flex flex-col items-center w-20">
                        <img src={event.home_team_logo} alt="Home" className="w-12 h-12 object-contain mb-2" />
                        <span className="font-bold text-sm text-center line-clamp-1">{event.home_team_abbr || 'LOC'}</span>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="text-3xl font-mono font-bold tracking-widest bg-slate-900 text-white dark:bg-black px-4 py-2 rounded-lg mb-1">
                            {event.home_score} - {event.away_score}
                        </div>
                        <div className={`text-sm font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${event.status === 'first_half' || event.status === 'second_half'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                            {(event.status === 'first_half' || event.status === 'second_half') && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                            {elapsed || '-'}
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-20">
                        <img src={event.away_team_logo} alt="Away" className="w-12 h-12 object-contain mb-2" />
                        <span className="font-bold text-sm text-center line-clamp-1">{event.away_team_abbr || 'VIS'}</span>
                    </div>
                </div>

                {/* Status Controls */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => onPhaseChange(event, 'scheduled')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors border ${event.status === 'scheduled' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        Previa
                    </button>
                    <button
                        onClick={() => onPhaseChange(event, 'first_half')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors border flex items-center gap-1 ${event.status === 'first_half' ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        <Play size={12} /> 1ª P
                    </button>
                    <button
                        onClick={() => onPhaseChange(event, 'halftime')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors border flex items-center gap-1 ${event.status === 'halftime' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        <Pause size={12} /> HT
                    </button>
                    <button
                        onClick={() => onPhaseChange(event, 'second_half')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors border flex items-center gap-1 ${event.status === 'second_half' ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        <Play size={12} /> 2ª P
                    </button>
                    <button
                        onClick={() => onPhaseChange(event, 'ended')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors border flex items-center gap-1 ${event.status === 'ended' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        <Square size={12} /> Fin
                    </button>
                </div>
            </div>

            {/* Score Controls */}
            <div className="grid grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl">
                <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Goles Local</p>
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => onScoreChange(event, 'home', -1)} className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold">-</button>
                        <span className="text-xl font-bold w-6">{event.home_score}</span>
                        <button onClick={() => onScoreChange(event, 'home', 1)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center hover:bg-blue-200 font-bold">+</button>
                    </div>
                </div>
                <div className="text-center border-l border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Goles Visitante</p>
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => onScoreChange(event, 'away', -1)} className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold">-</button>
                        <span className="text-xl font-bold w-6">{event.away_score}</span>
                        <button onClick={() => onScoreChange(event, 'away', 1)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center hover:bg-blue-200 font-bold">+</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatusManager;
