'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const navItems = [
  { path: '#about', name: 'About' },
  { path: '#projects', name: 'Portfolio/Projects' },
  { path: '#hobbies', name: 'Hobbies' },
  { path: '#resume', name: 'Resume' },
];

export function Navbar() {
  const [activeHash, setActiveHash] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to track scroll position and update the active hash
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Iterate through each section to find the one in view
      const sectionOffsets = navItems.map((item) => {
        const element = document.querySelector(item.path) as HTMLElement | null; // Type assertion here
        return element
          ? { path: item.path, offsetTop: element.offsetTop, offsetHeight: element.offsetHeight }
          : null;
      }).filter(Boolean);

      let activeSection = '';

      sectionOffsets.forEach((section) => {
        if (
          scrollPosition >= section.offsetTop - 100 && 
          scrollPosition < section.offsetTop + section.offsetHeight - 100
        ) {
          activeSection = section.path;
        }
      });

      setActiveHash(activeSection); // Update active hash based on scroll position
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial active hash based on current scroll position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-md shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Logo Section */}
        <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
          <Link href="/">MV</Link> 
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => {
            const isActive = activeHash === item.path;  
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative group text-black flex items-center px-3 py-2 transition-colors duration-300 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-bold' : ''}`}
              >
                {item.name}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="underline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded"
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-indigo-600 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white text-black py-4"
          >
            <div className="flex flex-col items-center">
              {navItems.map((item) => {
                const isActive = activeHash === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative group text-lg px-3 py-2 mb-2 transition-colors duration-300 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-bold' : ''}`}
                  >
                    {item.name}
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId="underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded"
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
