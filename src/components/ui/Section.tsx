import type { ReactNode } from 'react';
import { Container } from './Container';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import styles from './Section.module.css';

interface SectionProps {
  children: ReactNode;
  id?: string;
  eyebrow?: string;
  title?: string;
  className?: string;
  /** Fuer Sektionen, die ihre Breite selbst steuern (z.B. Sticky-Stack). */
  bleed?: boolean;
}

export function Section({ children, id, eyebrow, title, className, bleed = false }: SectionProps) {
  const header =
    eyebrow || title ? (
      <ScrollReveal className={styles.header}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? <h2 className={styles.title}>{title}</h2> : null}
      </ScrollReveal>
    ) : null;

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <section id={id} className={[styles.section, className].filter(Boolean).join(' ')}>
      {bleed ? body : <Container>{body}</Container>}
    </section>
  );
}
