import { z } from 'zod';

/**
 * Zweisprachiger Wert. Beide Sprachen sind Pflicht, damit im Build auffaellt,
 * wenn eine Uebersetzung vergessen wurde - und nicht erst auf der Seite.
 */
export const localized = <T extends z.ZodTypeAny>(inner: T) => z.object({ de: inner, en: inner });

export type Localized<T> = { de: T; en: T };

export const jobSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  /** Autotronic hat keine Website mehr - null ist ein gueltiger Zustand. */
  link: z.string().url().nullable(),
  from: z.string().regex(/^\d{4}$/),
  /** null bedeutet "bis heute". */
  till: z
    .string()
    .regex(/^\d{4}$/)
    .nullable(),
  role: localized(z.string().min(1)),
  /** Absaetze als Array - ersetzt die alten, in den String eingebetteten <br />. */
  description: localized(z.array(z.string().min(1)).min(1)),
  current: z.boolean().default(false),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug muss kebab-case sein'),
  name: z.string().min(1),
  type: z.enum(['saas', 'product', 'personal']),
  year: z.string().min(4),
  role: localized(z.string().min(1)),
  summary: localized(z.string().min(1)),
  /** Ergebnisorientierte Einzeile fuer die Work-Karte. */
  outcome: localized(z.string().min(1)),
  description: localized(z.array(z.string().min(1)).min(1)),
  technologies: z.array(z.string().min(1)).min(1),
  /** Im Altbestand mal "" und mal null - hier auf null normalisiert. */
  github: z.string().url().nullable(),
  url: z.string().url().nullable(),
  featured: z.boolean().default(false),
  /** Steuert die Einfaerbung des Hover-Cursors. */
  palette: z.enum(['yellow', 'blue', 'green', 'violet']),
});

export const skillGroupSchema = z.object({
  id: z.string().min(1),
  title: localized(z.string().min(1)),
  items: z.array(z.string().min(1)).min(1),
});

export const ossRepoSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  language: z.string().min(1),
  description: localized(z.string().min(1)),
});

export const serviceSchema = z.object({
  id: z.string().min(1),
  title: localized(z.string().min(1)),
  description: localized(z.string().min(1)),
  bullets: localized(z.array(z.string().min(1)).min(1)),
  palette: z.enum(['yellow', 'blue', 'green', 'violet']),
});

export const principleSchema = z.object({
  id: z.string().min(1),
  title: localized(z.string().min(1)),
  body: localized(z.string().min(1)),
});

export const educationSchema = z.object({
  id: z.string().min(1),
  institution: z.string().min(1),
  qualification: localized(z.string().min(1)),
  from: z.string().min(4),
  till: z.string().min(4),
});

export const certificationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  issuer: z.string().min(1),
  issued: z.string().min(4),
  expires: z.string().min(4).nullable(),
});

export type Job = z.infer<typeof jobSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type OssRepo = z.infer<typeof ossRepoSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Principle = z.infer<typeof principleSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;

/**
 * Validiert zur Modul-Ladezeit, also waehrend `next build`. Ein Tippfehler
 * bricht damit den Build und nicht die ausgelieferte Seite.
 */
export function parseAll<T extends z.ZodTypeAny>(schema: T, data: unknown[], label: string) {
  const result = z.array(schema).safeParse(data);
  if (!result.success) {
    throw new Error(
      `Content-Validierung fehlgeschlagen (${label}):\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
