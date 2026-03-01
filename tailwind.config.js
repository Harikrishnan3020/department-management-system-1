/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        'bg-blue-600/30', 'bg-purple-600/30', 'bg-emerald-500/20',
        'bg-rose-600/30', 'bg-fuchsia-600/30', 'bg-cyan-500/20',
        'bg-emerald-600/30', 'bg-teal-600/30', 'bg-lime-500/20',
        'bg-amber-600/30', 'bg-orange-600/30', 'bg-red-500/20',
        'bg-cyan-600/30', 'bg-blue-700/30', 'bg-indigo-600/20',
        'bg-red-700/30', 'bg-violet-600/30', 'bg-fuchsia-500/30', 'bg-pink-500/20',
        'bg-electric-blue/20', 'bg-royal-purple/20', 'bg-emerald-glow/10',
        'bg-rose-500/20', 'bg-fuchsia-600/20', 'bg-cyan-400/10',
        'bg-emerald-glow/20', 'bg-teal-500/20', 'bg-lime-400/10',
        'bg-luxury-gold/20', 'bg-orange-500/20', 'bg-rose-500/10',
        'bg-cyan-500/20', 'bg-blue-600/20', 'bg-indigo-500/10',
        'bg-red-600/20', 'bg-orange-600/10'
    ],
    theme: {
        extend: {
            colors: {
                'brand-bg-1': '#020617',
                'brand-bg-2': '#070d1a',
                'brand-bg-3': '#0f172a',
                'electric-blue': '#3b82f6',
                'royal-purple': '#7c3aed',
                'emerald-glow': '#10b981',
                'luxury-gold': '#facc15',
                'glass-bg': 'rgba(15, 23, 42, 0.4)',
                'glass-border': 'rgba(255, 255, 255, 0.08)',
                'glass-highlight': 'rgba(255, 255, 255, 0.12)',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'cinematic-gradient': 'linear-gradient(135deg, #020617 0%, #070d1a 50%, #0f172a 100%)',
                'neon-border-blue': 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                'neon-border-purple': 'linear-gradient(90deg, transparent, #7c3aed, transparent)',
            },
            boxShadow: {
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
                'glow-purple': '0 0 20px rgba(124, 58, 237, 0.5)',
                'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.5)',
                'glow-gold': '0 0 20px rgba(250, 204, 21, 0.5)',
                'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            },
            animation: {
                'blob': 'blob 10s infinite',
                'gradient-x': 'gradient-x 15s ease infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center',
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
