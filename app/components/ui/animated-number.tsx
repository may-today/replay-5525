'use client';
import { cn } from '~/lib/utils';
import { motion, type SpringOptions, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

type AnimatedNumber = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
};

export function AnimatedNumber({
  value = 0,
  className,
  springOptions,
}: AnimatedNumber) {
  const spring = useSpring(value, springOptions || {
    bounce: 0,
    duration: 2000,
  });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn('tabular-nums', className)}>
      {display}
    </motion.span>
  );
}
