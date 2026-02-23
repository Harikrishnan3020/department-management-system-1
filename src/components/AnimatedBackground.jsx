import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-brand-bg-1 pointer-events-none">
            {/* Deep Space Background Mesh */}
            <div className="absolute inset-0 bg-cinematic-gradient opacity-90 animate-gradient-x mix-blend-overlay"></div>

            {/* Glow Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-electric-blue/20 rounded-full blur-[120px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -40, 0],
                    y: [0, 80, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-royal-purple/20 rounded-full blur-[140px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-glow/10 rounded-full blur-[150px] mix-blend-screen"
            />

            {/* Noise Overlay for Cinematic Feel */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        </div>
    );
};

export default AnimatedBackground;
