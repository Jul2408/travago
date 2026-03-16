'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterEffectProps {
    words: string[];
    className?: string;
}

export const TypewriterEffect = ({ words, className }: TypewriterEffectProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const currentWord = words[currentWordIndex];

            if (isDeleting) {
                setCurrentText((prev) => prev.slice(0, -1));
                setTypingSpeed(50);
            } else {
                setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
                setTypingSpeed(150);
            }

            if (!isDeleting && currentText === currentWord) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && currentText === '') {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed]);

    return (
        <span className={className}>
            {currentText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                className="inline-block w-[4px] h-[0.9em] bg-blue-500 ml-1 align-middle"
            />
        </span>
    );
};
