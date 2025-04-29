import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

// Custom page transition manager that applies different transitions based on routes
const PageTransitionManager = ({ children }) => {
  const location = useLocation();
  const prevLocation = useRef(location.pathname);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  
  // Initialize overlay elements
  useEffect(() => {
    // Create different overlay elements for transitions
    if (!document.querySelector('.page-transition-overlay')) {
      // Main overlay
      const overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = '#4F46E5';
      overlay.style.zIndex = '100';
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';
      document.body.appendChild(overlay);
      overlayRef.current = overlay;
      
      // Content container reference - assume it exists in the DOM
      contentRef.current = document.querySelector('#root') || document.body;
    } else {
      overlayRef.current = document.querySelector('.page-transition-overlay');
    }
    
    // Clean up on unmount
    return () => {
      if (overlayRef.current && document.body.contains(overlayRef.current)) {
        document.body.removeChild(overlayRef.current);
      }
    };
  }, []);
  
  // Execute transitions on route change
  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      executeTransition(prevLocation.current, location.pathname);
      prevLocation.current = location.pathname;
    }
  }, [location]);
  
  // Determine and execute the right transition based on routes
  const executeTransition = (fromPath, toPath) => {
    // Reset any ongoing animations
    gsap.killTweensOf('*');
    
    const currentContent = document.querySelectorAll('.page-content > *');
    
    // Map page paths to specific transitions
    if (fromPath === '/' && toPath.includes('legal')) {
      // Home to Legal Resources: Slide right transition
      slideTransition('right', currentContent);
    } 
    else if (toPath === '/' && fromPath.includes('legal')) {
      // Legal to Home: Slide left transition
      slideTransition('left', currentContent);
    }
    else if (toPath.includes('schedule') || fromPath.includes('schedule')) {
      // Any schedule page: Fade zoom transition
      fadeZoomTransition(currentContent);
    }
    else if (toPath.includes('chat') || fromPath.includes('chat')) {
      // Chat pages: Split transition
      splitTransition(currentContent);
    }
    else if (toPath.includes('login') || toPath.includes('register')) {
      // Auth pages: Flip transition
      flipTransition(currentContent);
    }
    else if (toPath.includes('contact')) {
      // Contact page: Circle reveal
      circleRevealTransition(currentContent);
    }
    else {
      // Default: Fade transition
      fadeTransition(currentContent);
    }
  };
  
  // Different transition types
  const fadeTransition = (currentContent) => {
    const tl = gsap.timeline();
    
    tl.to(currentContent, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    })
    .set(overlayRef.current, { 
      opacity: 1,
      backgroundColor: '#4F46E5' 
    })
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.inOut'
    });
    
    // Entrance animation
    setTimeout(() => {
      const newContent = document.querySelectorAll('.page-content > *');
      gsap.fromTo(newContent, 
        { opacity: 0 },
        { opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
      );
    }, 500);
  };
  
  const slideTransition = (direction, currentContent) => {
    const xFrom = direction === 'right' ? '100%' : '-100%';
    const xTo = direction === 'right' ? '-100%' : '100%';
    
    const tl = gsap.timeline();
    
    // Exit current content
    tl.to(currentContent, {
      x: xTo,
      opacity: 0,
      stagger: 0.05,
      duration: 0.4,
      ease: 'power2.in'
    })
    .set(overlayRef.current, { 
      opacity: 1,
      x: xFrom,
      backgroundColor: '#22c55e' // Green for slide transitions
    })
    .to(overlayRef.current, {
      x: '0%',
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .to(overlayRef.current, {
      x: xTo,
      duration: 0.5,
      ease: 'power2.inOut'
    });
    
    // Entrance animation
    setTimeout(() => {
      const newContent = document.querySelectorAll('.page-content > *');
      gsap.fromTo(newContent, 
        { x: xFrom, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out' }
      );
    }, 900);
  };
  
  const fadeZoomTransition = (currentContent) => {
    const tl = gsap.timeline();
    
    // Exit animation
    tl.to(currentContent, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in'
    })
    .set(overlayRef.current, { 
      opacity: 1,
      scale: 1.5, 
      backgroundColor: '#f59e0b' // Amber for zoom transitions
    })
    .to(overlayRef.current, {
      scale: 1,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
    
    // Entrance animation
    setTimeout(() => {
      const newContent = document.querySelectorAll('.page-content > *');
      gsap.fromTo(newContent, 
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }
      );
    }, 600);
  };
  
  const splitTransition = (currentContent) => {
    // Create split overlays if they don't exist
    let topSplit = document.querySelector('.split-overlay-top');
    let bottomSplit = document.querySelector('.split-overlay-bottom');
    
    if (!topSplit) {
      topSplit = document.createElement('div');
      topSplit.className = 'split-overlay-top';
      topSplit.style.position = 'fixed';
      topSplit.style.top = '0';
      topSplit.style.left = '0';
      topSplit.style.right = '0';
      topSplit.style.height = '50%';
      topSplit.style.backgroundColor = '#3b82f6'; // Blue for split transitions
      topSplit.style.zIndex = '100';
      topSplit.style.transformOrigin = 'top';
      topSplit.style.transform = 'scaleY(0)';
      document.body.appendChild(topSplit);
    }
    
    if (!bottomSplit) {
      bottomSplit = document.createElement('div');
      bottomSplit.className = 'split-overlay-bottom';
      bottomSplit.style.position = 'fixed';
      bottomSplit.style.bottom = '0';
      bottomSplit.style.left = '0';
      bottomSplit.style.right = '0';
      bottomSplit.style.height = '50%';
      bottomSplit.style.backgroundColor = '#3b82f6';
      bottomSplit.style.zIndex = '100';
      bottomSplit.style.transformOrigin = 'bottom';
      bottomSplit.style.transform = 'scaleY(0)';
      document.body.appendChild(bottomSplit);
    }
    
    const tl = gsap.timeline();
    
    // Exit animation
    tl.to(currentContent, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in'
    })
    .to([topSplit, bottomSplit], {
      scaleY: 1,
      duration: 0.6,
      ease: 'power3.inOut'
    })
    .to([topSplit, bottomSplit], {
      scaleY: 0,
      duration: 0.6,
      ease: 'power3.inOut'
    });
    
    // Entrance animation
    setTimeout(() => {
      const newContent = document.querySelectorAll('.page-content > *');
      gsap.fromTo(newContent, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
      );
    }, 1200);
  };
  
  const flipTransition = (currentContent) => {
    // Set perspective on the body
    gsap.set(document.body, { perspective: 1200 });
    
    const tl = gsap.timeline();
    
    // Exit animation
    tl.to(currentContent, {
      opacity: 0,
      rotationY: 90,
      duration: 0.6,
      ease: 'power3.in'
    })
    .set(overlayRef.current, { 
      opacity: 1,
      rotationY: -90,
      backgroundColor: '#ec4899' // Pink for flip transitions
    })
    .to(overlayRef.current, {
      rotationY: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .to(overlayRef.current, {
      rotationY: 90,
      duration: 0.6,
      ease: 'power3.in'
    })
    .set(overlayRef.current, { opacity: 0 });
    
    // Entrance animation
    setTimeout(() => {
      const newContent = document.querySelectorAll('.page-content > *');
      gsap.fromTo(newContent, 
        { opacity: 0, rotationY: -90 },
        { opacity: 1, rotationY: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
      );
    }, 1200);
  };
  
  const circleRevealTransition = (currentContent) => {
    // Get the center coordinates
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Use clip-path for the circle reveal
    gsap.set(overlayRef.current, { 
      opacity: 1,
      backgroundColor: '#8b5cf6', // Purple for circle transitions
      clipPath: `circle(0% at ${centerX}px ${centerY}px)`
    });
    
    const tl = gsap.timeline();
    
    // Exit animation
    tl.to(currentContent, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'power2.in'
    })
    .to(overlayRef.current, {
      clipPath: `circle(150% at ${centerX}px ${centerY}px)`,
      duration: 0.8,
      ease: 'power3.inOut'
    })
    .to(overlayRef.current, {
      clipPath: `circle(0% at ${centerX}px ${centerY}px)`,
      duration: 0.8,
      ease: 'power3.inOut'
    });
    
    // Entrance animation
    setTimeout(() => {
      const newContent = document.querySelectorAll('.page-content > *');
      gsap.fromTo(newContent, 
        { opacity: 0, scale: 1.1 },
        { 
          opacity: 1, 
          scale: 1, 
          stagger: 0.1, 
          duration: 0.6, 
          ease: 'power3.out',
          onComplete: () => {
            // Reset any transforms on the body
            gsap.set(document.body, { clearProps: "perspective" });
          }
        }
      );
    }, 1600);
  };
  
  return <>{children}</>;
};

export default PageTransitionManager;