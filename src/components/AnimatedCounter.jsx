import React, { useState, useEffect, useRef } from 'react';

export const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Extract pure target number from string if passed as string (e.g. "10000" or "75")
  const targetNumber = typeof end === 'number' ? end : parseInt(String(end).replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function for smooth count up (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeProgress * targetNumber);

            setCount(currentCount);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(targetNumber);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [targetNumber, duration, hasAnimated]);

  // Format with commas (e.g., 10,000)
  const formattedCount = count.toLocaleString('en-IN');

  return (
    <span ref={countRef} className={className}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
};
