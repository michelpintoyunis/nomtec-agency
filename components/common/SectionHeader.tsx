import React from 'react';

interface SectionHeaderProps {
    subtitle: string;
    title: string;
    description?: string;
    align?: 'center' | 'left';
    className?: string; // Allow custom classes
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    subtitle,
    title,
    description,
    align = 'center',
    className = ''
}) => {
    return (
        <div className={`${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-3xl ${className}`}>
            <h2 className="text-blue-700 dark:text-blue-500 font-bold font-display tracking-widest uppercase text-xs mb-3">
                {subtitle}
            </h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 uppercase">
                {title}
            </h3>
            {description && (
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
