import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const colorThemes = [
    // Standard Blue/Purple
    { orb1: 'bg-electric-blue/20', orb2: 'bg-royal-purple/20', orb3: 'bg-emerald-glow/10' },
    // Cyberpunk Neon
    { orb1: 'bg-rose-500/20', orb2: 'bg-fuchsia-600/20', orb3: 'bg-cyan-400/10' },
    // Emerald Forest
    { orb1: 'bg-emerald-glow/20', orb2: 'bg-teal-500/20', orb3: 'bg-lime-400/10' },
    // Sunset Gold
    { orb1: 'bg-luxury-gold/20', orb2: 'bg-orange-500/20', orb3: 'bg-rose-500/10' },
    // Deep Ocean
    { orb1: 'bg-cyan-500/20', orb2: 'bg-blue-600/20', orb3: 'bg-indigo-500/10' },
    // Midnight Ruby
    { orb1: 'bg-red-600/20', orb2: 'bg-rose-500/20', orb3: 'bg-orange-600/10' }
];

const AnimatedBackground = () => {
    const [themeIndex, setThemeIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setThemeIndex(prev => (prev + 1) % colorThemes.length);
        }, 12000); // Crossfade theme every 12 seconds

        return () => clearInterval(interval);
    }, []);

    const theme = colorThemes[themeIndex];

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-brand-bg-1 pointer-events-none">
            {/* Deep Space Background Mesh */}
            <div className="absolute inset-0 bg-cinematic-gradient opacity-90 animate-gradient-x mix-blend-overlay"></div>

            {/* Glow Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className={`absolute top-0 left-1/4 w-[600px] h-[600px] ${theme.orb1} rounded-full blur-[100px] mix-blend-screen transition-colors duration-[3000ms]`}
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, -40, 0],
                    y: [0, 80, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={`absolute bottom-0 right-1/4 w-[700px] h-[700px] ${theme.orb2} rounded-full blur-[120px] mix-blend-screen transition-colors duration-[3000ms]`}
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${theme.orb3} rounded-full blur-[130px] mix-blend-screen transition-colors duration-[3000ms]`}
            />

            {/* Noise Overlay for Cinematic Feel */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        </div>
    );
};

export default AnimatedBackground;
