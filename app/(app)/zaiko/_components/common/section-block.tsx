'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { slideInUp } from '../../_lib/motion-presets';

interface SectionBlockProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionBlock({
  title,
  subtitle,
  children,
  className,
  id,
}: SectionBlockProps) {
  return (
    <section id={id} className={cn('py-12', className)}>
      <motion.div
        variants={slideInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-base text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </motion.div>
    </section>
  );
}

