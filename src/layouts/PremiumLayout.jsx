import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

const PremiumLayout = () => {
    return (
        <div className="relative min-h-screen">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PremiumLayout;
