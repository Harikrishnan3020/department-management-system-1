import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const colorThemes = [
    // Standard Blue/Purple
    { orb1: 'bg-blue-500/50', orb2: 'bg-purple-500/50', orb3: 'bg-emerald-400/40' },
    // Cyberpunk Neon
    { orb1: 'bg-rose-500/50', orb2: 'bg-fuchsia-500/50', orb3: 'bg-cyan-400/40' },
    // Emerald Forest
    { orb1: 'bg-emerald-500/50', orb2: 'bg-teal-500/50', orb3: 'bg-lime-400/40' },
    // Sunset Gold
    { orb1: 'bg-amber-500/50', orb2: 'bg-orange-500/50', orb3: 'bg-rose-400/40' },
    // Deep Ocean
    { orb1: 'bg-cyan-500/50', orb2: 'bg-blue-500/50', orb3: 'bg-indigo-400/40' },
    // Midnight Ruby
    { orb1: 'bg-red-500/50', orb2: 'bg-rose-500/50', orb3: 'bg-orange-500/40' },
    // Amethyst Dream
    { orb1: 'bg-violet-500/50', orb2: 'bg-fuchsia-400/50', orb3: 'bg-pink-400/40' }
];

const AnimatedBackground = () => {
    // Pick a completely random theme on every single page load/refresh
    const [themeIndex, setThemeIndex] = useState(() => Math.floor(Math.random() * colorThemes.length));

    // Generate random animation drift patterns so the orbs move differently on every refresh
    const [animConfig] = useState(() => {
        const randomPath = () => [0, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800, 0];
        const randomScale = () => [1, 1.3 + Math.random() * 0.5, 1];
        const randomOpacity = () => [0.4, 0.7 + Math.random() * 0.3, 0.4];

        return {
            dur1: 8 + Math.random() * 6, // 8-14s so it's noticeably moving
            dur2: 9 + Math.random() * 6,
            dur3: 10 + Math.random() * 6,
            x1: randomPath(), y1: randomPath(),
            x2: randomPath(), y2: randomPath(),
            x3: randomPath(), y3: randomPath(),
            s1: randomScale(), o1: randomOpacity(),
            s2: randomScale(), o2: randomOpacity(),
            s3: randomScale(), o3: randomOpacity(),
        };
    });

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
                    scale: animConfig.s1,
                    opacity: animConfig.o1,
                    x: animConfig.x1,
                    y: animConfig.y1
                }}
                transition={{ duration: animConfig.dur1, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-0 left-1/4 w-[600px] h-[600px] ${theme.orb1} rounded-full blur-[100px] mix-blend-screen transition-colors duration-1000`}
            />

            <motion.div
                animate={{
                    scale: animConfig.s2,
                    opacity: animConfig.o2,
                    x: animConfig.x2,
                    y: animConfig.y2
                }}
                transition={{ duration: animConfig.dur2, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute bottom-0 right-1/4 w-[700px] h-[700px] ${theme.orb2} rounded-full blur-[100px] mix-blend-screen transition-colors duration-1000`}
            />

            <motion.div
                animate={{
                    scale: animConfig.s3,
                    opacity: animConfig.o3,
                    x: animConfig.x3,
                    y: animConfig.y3
                }}
                transition={{ duration: animConfig.dur3, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${theme.orb3} rounded-full blur-[120px] mix-blend-screen transition-colors duration-1000`}
            />

            {/* Noise Overlay for Cinematic Feel */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        </div>
    );
};

export default AnimatedBackground;
