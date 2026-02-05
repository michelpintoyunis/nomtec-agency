import { useState } from 'react';
import { generateContentIdeas } from '../services/geminiService';
import { GeneratedIdea, LoadingState } from '../types';

export const useIdeaGenerator = () => {
    const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
    const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
    const [error, setError] = useState<unknown>(null);

    const generateIdeas = async (topic: string, platform: string) => {
        if (!topic.trim()) return;

        setStatus(LoadingState.LOADING);
        setIdeas([]);
        setError(null);

        try {
            const result = await generateContentIdeas(topic, platform);
            setIdeas(result);
            setStatus(LoadingState.SUCCESS);
        } catch (err) {
            console.error(err);
            setError(err);
            setStatus(LoadingState.ERROR);
        }
    };

    const reset = () => {
        setIdeas([]);
        setStatus(LoadingState.IDLE);
        setError(null);
    }

    return { ideas, status, error, generateIdeas, reset };
};
