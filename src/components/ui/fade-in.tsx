'use client';

/**
 * FadeIn — wrapper de Framer Motion para animaciones de entrada.
 *
 * Uso:
 *   <FadeIn>contenido</FadeIn>
 *   <FadeIn delay={0.2}>contenido con delay</FadeIn>
 *   <FadeIn direction="up">slide desde abajo</FadeIn>
 *
 * Implementado como client component liviano para mantener
 * server components limpios de 'use client'.
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInProps {
  children:   ReactNode;
  delay?:     number;       // segundos (default: 0)
  duration?:  number;       // segundos (default: 0.5)
  direction?: Direction;    // dirección del slide (default: 'up')
  once?:      boolean;      // animar solo la primera vez (default: true)
  className?: string;
}

const directionOffset: Record<Direction, { x?: number; y?: number }> = {
  up:    { y: 20 },
  down:  { y: -20 },
  left:  { x: 20 },
  right: { x: -20 },
  none:  {},
};

export function FadeIn({
  children,
  delay     = 0,
  duration  = 0.5,
  direction = 'up',
  once      = true,
  className,
}: FadeInProps) {
  const offset = directionOffset[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeInStagger — anima una lista de hijos con delay escalonado.
 *
 * Uso:
 *   <FadeInStagger>
 *     {items.map(item => <FadeInItem key={item.id}>{...}</FadeInItem>)}
 *   </FadeInStagger>
 */

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const staggerItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' as const, duration: 0.4 } },
};

interface FadeInStaggerProps {
  children:  ReactNode;
  className?: string;
  once?:     boolean;
}

export function FadeInStagger({ children, className, once = true }: FadeInStaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-30px' }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
