'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import {
  fadeIn,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
} from '../../_lib/motion-presets';

type MotionType =
  | 'fadeIn'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'scaleIn';

interface MotionContainerProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  type?: MotionType;
  children: React.ReactNode;
  delay?: number;
}

const variantsMap = {
  fadeIn,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
};

export function MotionContainer({
  type = 'fadeIn',
  children,
  delay = 0,
  ...props
}: MotionContainerProps) {
  const variants = variantsMap[type];

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

