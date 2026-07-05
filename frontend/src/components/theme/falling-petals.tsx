import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface FallingPetalsProps {
  density?: number;
  className?: string;
}

function createPetal(width: number, height: number): Petal {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 8 + Math.random() * 14,
    speedY: 0.3 + Math.random() * 0.9,
    drift: -0.7 + Math.random() * 1.4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: -0.01 + Math.random() * 0.02,
    opacity: 0.28 + Math.random() * 0.4,
  };
}

export function FallingPetals({ density = 22, className = '' }: FallingPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }

    const maybeContext = canvasElement.getContext('2d');
    if (!maybeContext) {
      return;
    }
    const drawingContext = maybeContext;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let petals: Petal[] = [];

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvasElement.width = width * ratio;
      canvasElement.height = height * ratio;
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      petals = Array.from({ length: density }, () => createPetal(width, height));
    }

    function drawPetal(petal: Petal) {
      drawingContext.save();
      drawingContext.translate(petal.x, petal.y);
      drawingContext.rotate(petal.rotation);
      drawingContext.scale(petal.size / 14, petal.size / 14);
      drawingContext.beginPath();
      drawingContext.moveTo(0, -10);
      drawingContext.bezierCurveTo(8, -10, 11, -2, 4, 6);
      drawingContext.bezierCurveTo(0, 10, -4, 8, -5, 3);
      drawingContext.bezierCurveTo(-10, -2, -8, -10, 0, -10);
      drawingContext.closePath();
      drawingContext.fillStyle = `rgba(231, 166, 183, ${petal.opacity})`;
      drawingContext.fill();
      drawingContext.strokeStyle = `rgba(173, 112, 96, ${petal.opacity * 0.55})`;
      drawingContext.lineWidth = 0.8;
      drawingContext.stroke();
      drawingContext.restore();
    }

    function step() {
      drawingContext.clearRect(0, 0, width, height);

      petals.forEach((petal) => {
        petal.y += petal.speedY;
        petal.x += Math.sin(petal.rotation * 3) * 0.45 + petal.drift * 0.15;
        petal.rotation += petal.rotationSpeed;

        if (petal.y > height + 32 || petal.x < -32 || petal.x > width + 32) {
          Object.assign(petal, createPetal(width, height), {
            y: -20 - Math.random() * 60,
          });
        }

        drawPetal(petal);
      });

      animationFrame = window.requestAnimationFrame(step);
    }

    resize();
    step();

    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
