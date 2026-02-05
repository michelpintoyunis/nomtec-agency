import React, { useState, useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';

interface LiveScoreProps {
    homeScore: number;
    awayScore: number;
    status: string | null;
}

const LiveScore: React.FC<LiveScoreProps> = ({ homeScore, awayScore, status }) => {
    const [displayHome, setDisplayHome] = useState(homeScore);
    const [displayAway, setDisplayAway] = useState(awayScore);
    const [showGoal, setShowGoal] = useState<'home' | 'away' | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip animation on initial load to prevent "Goal" on refresh
        if (isFirstRender.current) {
            setDisplayHome(homeScore);
            setDisplayAway(awayScore);
            isFirstRender.current = false;
            return;
        }

        // Only animate if match is live (first_half, second_half)
        const isLive = status === 'first_half' || status === 'second_half';

        if (!isLive) {
            setDisplayHome(homeScore);
            setDisplayAway(awayScore);
            return;
        }

        // Handle Home Goal
        if (homeScore > displayHome) {
            const timer = setTimeout(() => {
                setShowGoal('home');
                setDisplayHome(homeScore);
                setTimeout(() => setShowGoal(null), 3000); // Hide animation after 3s
            }, 5000); // 5s delay before updating/animating
            return () => clearTimeout(timer);
        } else if (homeScore < displayHome) {
            // Correction (goal cancelled)
            setDisplayHome(homeScore);
        }

        // Handle Away Goal
        if (awayScore > displayAway) {
            const timer = setTimeout(() => {
                setShowGoal('away');
                setDisplayAway(awayScore);
                setTimeout(() => setShowGoal(null), 3000);
            }, 5000);
            return () => clearTimeout(timer);
        } else if (awayScore < displayAway) {
            setDisplayAway(awayScore);
        }

    }, [homeScore, awayScore, status]);

    return (
        <div className="relative flex items-center justify-center gap-2">
            {/* Goal Celebration Overlay */}
            {showGoal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center -top-8 md:-top-12 pointer-events-none">
                    <div className="animate-bounce">
                        <span className="bg-yellow-400 text-black font-black text-xs md:text-sm px-3 py-1 rounded-full shadow-lg uppercase tracking-widest border-2 border-yellow-200 animate-pulse">
                            ¡GOOOOOOL!
                        </span>
                    </div>
                </div>
            )}

            {/* Scores with animation classes */}
            <span className={`text-3xl font-bold font-mono transition-all duration-500 ${showGoal === 'home' ? 'text-yellow-500 scale-125' : 'text-slate-900 dark:text-white'}`}>
                {displayHome}
            </span>

            <span className="text-xl text-slate-300 dark:text-slate-600">-</span>

            <span className={`text-3xl font-bold font-mono transition-all duration-500 ${showGoal === 'away' ? 'text-yellow-500 scale-125' : 'text-slate-900 dark:text-white'}`}>
                {displayAway}
            </span>
        </div>
    );
};

export default LiveScore;
