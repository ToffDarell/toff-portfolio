import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const loadingSteps = [
    'Initializing portfolio...',
    'Loading system assets...',
    'Crafting experiences...',
    'Welcome to Toff\'s Space.'
  ];

  useEffect(() => {
    // Lock scrolling while loading
    document.body.style.overflow = 'hidden';

    // Progress counter (takes exactly 1.5s to reach 100)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            document.body.style.overflow = '';
            onComplete();
          }, 500); // 0.5s exit transition delay (Total: 2.0s)
          return 100;
        }
        return prev + 1;
      });
    }, 15);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  useEffect(() => {
    // Dynamic text steps
    if (progress < 25) setStep(0);
    else if (progress < 55) setStep(1);
    else if (progress < 85) setStep(2);
    else setStep(3);
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white font-mono"
    >
      <div className="w-full max-w-xs px-6 flex flex-col space-y-6">
        
        {/* Domain Tag */}
        <div className="text-center mb-1">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-purple-400/80 uppercase">
            www.toffdarell.dev
          </span>
        </div>

        {/* Step Indicator */}
        <div className="h-6 overflow-hidden">
          <motion.p
            key={step}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-gray-500 uppercase tracking-widest text-center"
          >
            {loadingSteps[step]}
          </motion.p>
        </div>

        {/* Big Counter */}
        <div className="flex justify-center items-baseline">
          <motion.span 
            className="text-6xl font-extrabold tracking-tighter"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {progress}
          </motion.span>
          <span className="text-purple-400 text-xl font-bold ml-1">%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative">
          {/* Subtle glow behind the progress bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 filter blur-sm opacity-20"></div>
          {/* Active progress bar */}
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          />
        </div>

      </div>
    </motion.div>
  );
};

export default LoadingScreen;
