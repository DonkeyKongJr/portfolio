'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { Container } from '@/components/ui/Container';
import type { Locale } from '@/config/site';
import type { WorkGridItem } from '@/lib/viewModels';
import { WorkCard } from './WorkCard';
import styles from './WorkGrid.module.css';

type Filter = 'all' | WorkGridItem['type'];

export function WorkGrid({
  items,
  locale,
  filters,
}: {
  items: WorkGridItem[];
  locale: Locale;
  /** Vorbereitete Filterliste - der erste Eintrag ist immer "Alle". */
  filters: { key: Filter; label: string }[];
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = filter === 'all' ? items : items.filter((item) => item.type === filter);

  return (
    <Container>
      <div className={styles.filters}>
        {filters.map((entry) => (
          <button
            key={entry.key}
            type="button"
            className={styles.filter}
            aria-pressed={filter === entry.key}
            onClick={() => setFilter(entry.key)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {visible.map((item) => (
          <ScrollReveal key={item.slug}>
            <WorkCard item={item} locale={locale} />
          </ScrollReveal>
        ))}
      </div>
    </Container>
  );
}
