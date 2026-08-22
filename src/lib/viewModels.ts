import type { Locale } from '@/config/site';
import type { WorkCardItem } from '@/components/sections/WorkCard';
import type { Project } from '@/content/schema';
import type { Dictionary } from '@/i18n/types';

/**
 * Reduziert ein Projekt auf die Felder einer Sprache.
 *
 * Alles, was an eine Client-Komponente geht, wird in den RSC-Payload des
 * statischen HTML serialisiert. Zweisprachige Objekte dort durchzureichen
 * verdoppelt die Seitengroesse ohne Gegenwert.
 */
export function toWorkCardItem(project: Project, locale: Locale, t: Dictionary): WorkCardItem {
  return {
    slug: project.slug,
    name: project.name,
    year: project.year,
    outcome: project.outcome[locale],
    typeLabel: t.work.filters[project.type],
    technologies: [...project.technologies],
    palette: project.palette,
  };
}

export interface WorkGridItem extends WorkCardItem {
  type: Project['type'];
}

export function toWorkGridItem(project: Project, locale: Locale, t: Dictionary): WorkGridItem {
  return { ...toWorkCardItem(project, locale, t), type: project.type };
}
