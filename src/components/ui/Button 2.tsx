'use client';

import Link from 'next/link';
import { useCallback, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: 'outline' | 'primary';
  size?: 'default' | 'small';
  external?: boolean;
  className?: string;
}

/**
 * Button mit gerichteter Tintenfuellung: der Klecks geht dort auf, wo der
 * Zeiger eintritt, nicht in der Mitte. Das ist der Unterschied zwischen
 * "reagiert" und "fuehlt sich an".
 */
export function Button({
  children,
  href,
  variant = 'outline',
  size = 'default',
  external,
  className,
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const trackPointer = useCallback((event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const classes = [
    styles.button,
    variant === 'primary' ? styles.primary : '',
    size === 'small' ? styles.small : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const style = { '--blob-x': `${origin.x}%`, '--blob-y': `${origin.y}%` } as CSSProperties;

  const inner = (
    <>
      <span className={styles.blob} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </>
  );

  const handlers = {
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      trackPointer(event);
      setHover(true);
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      trackPointer(event);
      setHover(false);
    },
  };

  // mailto: und externe Ziele duerfen nicht durch den Client-Router laufen.
  const isPlainAnchor = external || href.startsWith('mailto:') || href.startsWith('http');

  if (isPlainAnchor) {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        data-hover={hover}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...handlers}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} style={style} data-hover={hover} {...handlers}>
      {inner}
    </Link>
  );
}
