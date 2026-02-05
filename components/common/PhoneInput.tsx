import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Loader2 } from 'lucide-react';
import { countries, Country } from '../../data/countries';
import { useLanguage } from '../../context/LanguageContext';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    required?: boolean;
    className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    id = "phone",
    required = false,
    className = ""
}) => {
    const { language } = useLanguage();
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.code === 'US') || countries[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial load: Try to split value if it exists, otherwise detect location
    useEffect(() => {
        if (value) {
            // Try to find matching country from value
            // Sort by length of dial_code descending to match longest code first (e.g. +1 vs +1-xxx if we had them, but we simplified)
            // Since we simplified, we just look for match.
            const sortedCountries = [...countries].sort((a, b) => b.dial_code.length - a.dial_code.length);
            const country = sortedCountries.find(c => value.startsWith(c.dial_code));

            if (country) {
                setSelectedCountry(country);
                setPhoneNumber(value.slice(country.dial_code.length).trim());
                setLoadingLocation(false);
            } else if (!phoneNumber && loadingLocation) {
                // Fallback if no match yet but maybe we need to fetch location?
                // If value is provided (e.g. editing), we shouldn't overwrite with geolocation unless value is empty?
                // Actually logic: if value is provided props, use it. If empty, try geo.
                setLoadingLocation(false);
            }
        } else {
            // No value provided, try geolocation
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    if (data && data.country_code) {
                        const country = countries.find(c => c.code === data.country_code);
                        if (country) setSelectedCountry(country);
                    }
                })
                .catch(err => console.error('Error detecting country:', err))
                .finally(() => setLoadingLocation(false));
        }
    }, []); // Run once on mount

    // Update parent when internal state changes
    useEffect(() => {
        if (phoneNumber) {
            // Clean phone number (remove spaces) for checking, but keep formatting?
            // User wants "clean prefix". The raw value sent to parent should likely be full E.164 or formatted?
            // Let's send separated by space for clarity or just joined?
            // Standard is joined, but let's keep space for readability if user prefers.
            // Usually +1 555xxxx.
            onChange(`${selectedCountry.dial_code} ${phoneNumber}`);
        } else if (value === '') {
            // If parent cleared it/empty
            onChange('');
        } else {
            // Phone number empty but selected country exists. Should we send just prefix?
            // Usually valid phone requires number. Send empty string if no number?
            // Or send prefix? Better to send empty if required check fails.
            // But existing logic sent prefix.
            // Let's allow parent to handle validation.
            onChange(`${selectedCountry.dial_code} ${phoneNumber}`);
        }
    }, [selectedCountry, phoneNumber]);


    // Helper to remove accents for search
    const normalizeText = (text: string) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    // Filter countries based on search
    const filteredCountries = countries.filter(country => {
        const name = language === 'es' ? country.name_es : country.name_en;
        const qNormalized = normalizeText(searchQuery);
        const nameNormalized = normalizeText(name);
        const qLower = searchQuery.toLowerCase();

        return nameNormalized.includes(qNormalized) ||
            country.dial_code.includes(qLower) ||
            country.code.toLowerCase().includes(qLower);
    });

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        setSearchQuery('');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getCountryName = (c: Country) => language === 'es' ? c.name_es : c.name_en;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="flex w-full">
                {/* Country Dropdown Trigger */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex-shrink-0 z-10 inline-flex items-center justify-between py-3 px-4 text-sm font-medium text-center text-slate-700 bg-slate-100 border border-slate-200 rounded-l-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors w-[90px]"
                >
                    {loadingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-500 mx-auto" />
                    ) : (
                        <>
                            <span className="truncate font-semibold">
                                {selectedCountry.dial_code}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-1 flex-shrink-0 opacity-50" />
                        </>
                    )}
                </button>

                {/* Phone Number Input */}
                <div className="relative w-full">
                    <input
                        type="tel"
                        id={id}
                        className="block w-full py-3 px-4 text-sm text-slate-900 bg-slate-50 rounded-r-lg border border-l-0 border-slate-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white dark:focus:border-blue-500 transition-colors outline-none h-full"
                        placeholder="123 456 7890"
                        value={phoneNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            const limit = selectedCountry.phone_limit || 15;
                            if (val.length <= limit) {
                                setPhoneNumber(val);
                            }
                        }}
                        maxLength={selectedCountry.phone_limit || 15}
                        required={required}
                    />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-20 top-full left-0 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 mt-1 max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 sticky top-0">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full p-2 ps-10 text-sm text-slate-900 border border-slate-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                placeholder={language === 'es' ? "Buscar país..." : "Search country..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <ul className="overflow-y-auto flex-1 p-1 custom-scrollbar">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <li key={country.code}>
                                    <button
                                        type="button"
                                        onClick={() => handleCountrySelect(country)}
                                        className={`w-full text-left flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors ${selectedCountry.code === country.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}
                                    >
                                        <span className="font-medium truncate mr-2">{getCountryName(country)}</span>
                                        <span className="text-slate-400 dark:text-slate-500 text-xs shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{country.dial_code}</span>
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                                {language === 'es' ? "No se encontraron resultados." : "No results found."}
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PhoneInput;
