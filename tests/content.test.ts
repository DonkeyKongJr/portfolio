import { describe, expect, it } from 'vitest';
import { principles, services, skillGroups } from '@/content/about';
import { currentJob, jobs } from '@/content/jobs';
import { featuredProjects, getProject, projects } from '@/content/projects';

describe('Werdegang', () => {
  it('hat genau eine aktuelle Station', () => {
    expect(jobs.filter((job) => job.current)).toHaveLength(1);
    expect(currentJob?.company).toBe('mrsd Solutions GmbH');
  });

  it('ist absteigend nach Startjahr sortiert', () => {
    const years = jobs.map((job) => Number(job.from));
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('laesst nur die aktuelle Station ohne Enddatum', () => {
    for (const job of jobs) {
      if (job.current) expect(job.till).toBeNull();
      else expect(job.till).not.toBeNull();
    }
  });

  it('hat keine doppelten Beschreibungen', () => {
    // Im Altbestand waren die beiden Provaria-Eintraege woertlich identisch.
    const texts = jobs.map((job) => job.description.en.join(' '));
    expect(new Set(texts).size).toBe(texts.length);
  });
});

describe('Projekte', () => {
  it('hat eindeutige Slugs', () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('findet Projekte ueber den Slug', () => {
    expect(getProject('qr-maker')?.name).toBe('QR-Maker');
    expect(getProject('gibt-es-nicht')).toBeUndefined();
  });

  it('hebt genau drei Projekte auf der Startseite hervor', () => {
    expect(featuredProjects).toHaveLength(3);
  });

  it('verwendet null statt Leerstring fuer fehlende Links', () => {
    for (const project of projects) {
      expect(project.github).not.toBe('');
      expect(project.url).not.toBe('');
    }
  });
});

describe('Uebrige Inhalte', () => {
  it('hat vier Prinzipien fuer den Sticky-Stack', () => {
    expect(principles).toHaveLength(4);
  });

  it('hat Leistungen mit unterschiedlichen Akzentfarben', () => {
    const palettes = services.map((service) => service.palette);
    expect(new Set(palettes).size).toBe(palettes.length);
  });

  it('listet keine Faehigkeit doppelt', () => {
    const all = skillGroups.flatMap((group) => group.items);
    expect(new Set(all).size).toBe(all.length);
  });
});
