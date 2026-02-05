
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../types';
import { supabase } from '../lib/supabase';

interface EventContextType {
    events: Event[];
    loading: boolean;
    addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
    deleteEvent: (id: number) => Promise<void>;
    updateEvent: (event: Event) => Promise<void>;
    reorderEvents: (events: Event[]) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            setLoading(true);

            // First try to fetch with sort_order
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('id', { ascending: false });

            if (error) {
                console.warn('Error fetching with sort_order, falling back to basic sort:', error);

                // Fallback: fetch without sort_order (in case column doesn't exist yet)
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('events')
                    .select('*')
                    .order('id', { ascending: false });

                if (fallbackError) {
                    console.error('Error fetching events (fallback):', fallbackError);
                } else {
                    const sortedFallback = (fallbackData || []).sort(sortEvents);
                    setEvents(sortedFallback);
                }
            } else {
                const sortedData = (data || []).sort(sortEvents);
                setEvents(sortedData);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    const sortEvents = (a: Event, b: Event) => {
        const orderA = a.sort_order ?? 0;
        const orderB = b.sort_order ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return b.id - a.id;
    };

    useEffect(() => {
        fetchEvents();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('events_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setEvents((prev) => [...prev, payload.new as Event].sort(sortEvents));
                } else if (payload.eventType === 'UPDATE') {
                    setEvents((prev) =>
                        prev.map((event) => (event.id === payload.new.id ? (payload.new as Event) : event))
                            .sort(sortEvents)
                    );
                } else if (payload.eventType === 'DELETE') {
                    setEvents((prev) => prev.filter((event) => event.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const checkUserExistence = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            alert('Tu usuario ha sido eliminado. Cerrando sesión...');
            window.location.reload();
            throw new Error('USER_DELETED');
        }
    };

    const addEvent = async (newEvent: Omit<Event, 'id'>) => {
        try {
            await checkUserExistence();

            const { error } = await supabase
                .from('events')
                .insert([newEvent]);

            if (error) throw error;

            // Refresh list
            await fetchEvents();
        } catch (error: any) {
            if (error.message === 'USER_DELETED') return;
            console.error('Error adding event:', error);
            alert('Error al guardar en Supabase');
        }
    };

    const deleteEvent = async (id: number) => {
        try {
            await checkUserExistence();

            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setEvents(prev => prev.filter(e => e.id !== id));
        } catch (error: any) {
            if (error.message === 'USER_DELETED') return;
            console.error('Error deleting event:', error);
            alert('Error al eliminar de Supabase');
            await fetchEvents();
        }
    };

    const updateEvent = async (updatedEvent: Event) => {
        try {
            await checkUserExistence();

            const { error } = await supabase
                .from('events')
                .update({
                    title: updatedEvent.title,
                    date: updatedEvent.date,
                    time: updatedEvent.time,
                    location: updatedEvent.location,
                    description: updatedEvent.description,
                    image: updatedEvent.image,
                    category: updatedEvent.category,
                    status: updatedEvent.status,
                    home_team: updatedEvent.home_team,
                    away_team: updatedEvent.away_team,
                    home_team_abbr: updatedEvent.home_team_abbr,
                    away_team_abbr: updatedEvent.away_team_abbr,
                    home_team_logo: updatedEvent.home_team_logo,
                    away_team_logo: updatedEvent.away_team_logo,
                    home_score: updatedEvent.home_score,
                    away_score: updatedEvent.away_score,
                    match_start_timestamp: updatedEvent.match_start_timestamp,
                    // We don't update sort_order here to avoid resetting it accidentally
                    // sort_order is handled exclusively by reorderEvents
                })
                .eq('id', updatedEvent.id);

            if (error) throw error;

            setEvents(prev =>
                prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
                    .sort(sortEvents)
            );
        } catch (error: any) {
            if (error.message === 'USER_DELETED') return;
            console.error('Error updating event:', error);
            alert('Error al actualizar en Supabase');
        }
    };

    const reorderEvents = async (newEvents: Event[]) => {
        // Optimistic update
        setEvents(newEvents);

        try {
            await checkUserExistence();

            // Update all items with their new index
            await Promise.all(
                newEvents.map((event, index) =>
                    supabase
                        .from('events')
                        .update({ sort_order: index })
                        .eq('id', event.id)
                )
            );
        } catch (error: any) {
            if (error.message === 'USER_DELETED') return;
            console.error('Error reordering events:', error);
            alert('Error al reordenar en Supabase');
            await fetchEvents(); // Revert on error
        }
    };

    return (
        <EventContext.Provider value={{ events, loading, addEvent, deleteEvent, updateEvent, reorderEvents }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};
