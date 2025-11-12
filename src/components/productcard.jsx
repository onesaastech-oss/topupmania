import { useRouter } from 'next/navigation';
import React, { useRef, useState, useCallback, useEffect } from 'react';

const ProductCard = ({ game }) => {
  const router = useRouter();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animationTimer = useRef(null);

  // Detect mobile - optimized with memoization
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    // Debounce resize events
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Optimized shine animation with cleanup
  useEffect(() => {
    const startAnimation = () => {
      const randomDelay = 3000 + Math.random() * 5000;
      animationTimer.current = setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
          startAnimation();
        }, 1000);
      }, randomDelay);
    };
    
    startAnimation();
    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, []);

  const handleCardClick = useCallback(() => {
    router.push(
      `/checkoutpage?gameId=${encodeURIComponent(game.id)}&gameName=${encodeURIComponent(
        game.name || game.title || ''
      )}&publisher=${encodeURIComponent(
        game.publisher || ''
      )}&image=${encodeURIComponent(game.image || '')}`
    );
  }, [router, game.id, game.name, game.title, game.publisher, game.image]);

  const handleMove = useCallback((clientX, clientY) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotate({
      x: (y - centerY) / 20,
      y: (centerX - x) / 20,
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isMobile) handleMove(e.clientX, e.clientY);
  }, [handleMove, isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true);
      setIsAnimating(true);
    }
  }, [isMobile]);

  const handleInteractionEnd = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  }, []);

  // Precompute transform styles to avoid inline calculations
  const cardTransform = isHovered ? 'scale(1.02)' : 'scale(1)';
  const imageTransform = isHovered && !isMobile ? 'scale-105' : 'scale-100';

  return (
    <div className="w-full h-full p-[0.15rem] aspect-[2/3] md:max-h-[500px] md:mx-auto perspective-[1200px]">
      <div
        ref={cardRef}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleInteractionEnd}
        style={{
          transform: cardTransform,
          transition: 'transform 220ms ease, box-shadow 260ms ease',
          border: '2px solid var(--glass-border)',
        }}
        className="relative w-full h-full flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 cursor-pointer will-change-transform"
      >
        {/* Shine effect */}
        <div
          className={`absolute inset-0 rounded-2xl mix-blend-overlay pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full rotate-[25deg] transition-opacity duration-300 ${
            isAnimating ? 'animate-shine opacity-100' : 'opacity-0'
          }`}
        />

        {/* Image container with instant loading */}
        <div className="relative w-full overflow-hidden rounded-t-2xl flex-grow min-h-0">
          {/* Background placeholder - removed loading state management */}
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800" />
          
          {/* Optimized image with instant display */}
          <img
            src={game.image}
            alt={game.name || game.title}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${imageTransform}`}
            style={{
              // Force immediate display, let browser handle loading
              display: 'block',
            }}
          />
          
          {/* Static overlay - always present */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent dark:from-black/80 dark:via-black/20 dark:to-transparent" />
        </div>

        {/* Info section - optimized text rendering */}
        <div className="relative w-full z-20 bg-white/80 dark:bg-black/60 border-t border-black/10 dark:border-white/10 rounded-b-2xl px-3 py-2 h-14 md:h-16 flex flex-col justify-center">
          <p 
            className="text-gray-900 dark:text-white font-semibold text-[11px] md:text-sm leading-tight truncate"
            title={game.name}
          >
            {game.name}
          </p>
          <p 
            className="text-gray-700 dark:text-gray-300 text-[10px] md:text-xs leading-snug truncate"
            title={game.publisher || 'Unknown Publisher'}
          >
            {game.publisher || 'Unknown Publisher'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;