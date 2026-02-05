
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Pricing from '../components/sections/Pricing';
import Events from '../components/sections/Events';
import Portfolio from '../components/sections/Portfolio';
import IdeaGenerator from '../components/sections/IdeaGenerator';
import Contact from '../components/sections/Contact';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <Hero />
            <Services />
            <Portfolio />
            <IdeaGenerator />
            <Pricing />
            <Events />
            <Contact />
            <Footer />
        </div>
    );
};

export default Home;
