import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    // Snowfall effect on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create snowflakes
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 0.8 + 0.2,
                wind: Math.random() * 0.4 - 0.2,
                opacity: Math.random() * 0.6 + 0.2,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();

                p.y += p.speed;
                p.x += p.wind + Math.sin(p.y * 0.01) * 0.3;

                if (p.y > canvas.height) {
                    p.y = -5;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1117 25%, #0f0a1e 50%, #0a1628 75%, #060d18 100%)' }}>
            {/* Aurora Layer 1 - Green/Teal */}
            <motion.div
                animate={{
                    x: [0, 80, -40, 60, 0],
                    y: [0, -30, 20, -50, 0],
                    scale: [1, 1.3, 0.9, 1.2, 1],
                    opacity: [0.25, 0.45, 0.2, 0.4, 0.25],
                    rotate: [0, 5, -3, 8, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-32 left-0 w-[900px] h-[400px] rounded-full blur-[120px]"
                style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.35), rgba(6,182,212,0.3), rgba(34,211,238,0.2))' }}
            />

            {/* Aurora Layer 2 - Purple/Violet */}
            <motion.div
                animate={{
                    x: [0, -60, 40, -80, 0],
                    y: [0, 40, -20, 30, 0],
                    scale: [1, 1.2, 1.4, 0.9, 1],
                    opacity: [0.2, 0.4, 0.25, 0.45, 0.2],
                    rotate: [0, -8, 5, -3, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-0 w-[800px] h-[350px] rounded-full blur-[130px]"
                style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(168,85,247,0.25), rgba(217,70,239,0.2))' }}
            />

            {/* Aurora Layer 3 - Blue/Indigo */}
            <motion.div
                animate={{
                    x: [0, 50, -70, 30, 0],
                    y: [0, -40, 50, -20, 0],
                    scale: [1, 1.1, 1.3, 1, 1],
                    opacity: [0.15, 0.35, 0.2, 0.4, 0.15],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-1/4 w-[700px] h-[300px] rounded-full blur-[140px]"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.25), rgba(79,70,229,0.2))' }}
            />

            {/* Aurora Layer 4 - Pink/Rose accent */}
            <motion.div
                animate={{
                    x: [0, -40, 60, -30, 0],
                    y: [0, 30, -40, 20, 0],
                    scale: [0.8, 1.1, 0.9, 1.2, 0.8],
                    opacity: [0.1, 0.25, 0.15, 0.3, 0.1],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 right-1/4 w-[600px] h-[280px] rounded-full blur-[150px]"
                style={{ background: 'linear-gradient(90deg, rgba(244,63,94,0.2), rgba(251,113,133,0.15), rgba(253,164,175,0.1))' }}
            />

            {/* Deep glow orb bottom-left */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[160px]"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)' }}
            />

            {/* Snowfall Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />

            {/* Subtle noise overlay */}
            <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Vignette */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }}></div>
        </div>
    );
};

export default AnimatedBackground;
