import { useState, useEffect } from 'react';

export const useScroll = (threshold: number = 20) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > threshold);
        };

        // Check initially to verify state if page is reloaded scrolled down
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isScrolled;
};
