import React, { useEffect, useState, useRef } from 'react';

export default function MagneticCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrame;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isInteractive = target.closest('button, a, input, [role="button"], .sticker-pill, .brutal-card');
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    const renderLoop = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      setPosition({ x: currentX, y: currentY });
      animationFrame = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Magnetic Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full border-2 border-[#FF4D00] transition-transform duration-75 ease-out ${
          isHovered ? 'scale-150 bg-[#FF4D00]/15 border-[#141414]' : 'scale-100'
        } ${isClicked ? 'scale-75 bg-[#FF4D00]' : ''}`}
        style={{
          width: '28px',
          height: '28px',
          transform: `translate3d(${position.x - 14}px, ${position.y - 14}px, 0) scale(${isHovered ? 1.4 : 1})`,
          transition: 'transform 0.08s ease-out, width 0.15s ease, height 0.15s ease, background-color 0.15s ease',
        }}
      />
      {/* Inner Pinpoint */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-[#141414]"
        style={{
          width: '6px',
          height: '6px',
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
        }}
      />
    </>
  );
}
