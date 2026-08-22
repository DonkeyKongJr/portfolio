import type { SVGProps } from 'react';

/**
 * Inline-SVGs statt des frueheren Font-Awesome-Kits.
 * Das Kit lud ~90 KB von einer Fremddomain, um sechs Icons zu zeigen.
 * Alle Icons sind rein dekorativ - der zugaengliche Name steht am Link.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true as const,
  focusable: 'false' as const,
};

export function GitHubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.57.1.78-.25.78-.55v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function DevIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.3 8.6c-.2-.15-.4-.22-.6-.22H2.85v7.25h.85c.2 0 .4-.07.6-.22.2-.15.3-.37.3-.67V9.27c0-.3-.1-.52-.3-.67Zm12.6 1.87c.1-.1.16-.24.16-.4V9.3c0-.16-.05-.3-.16-.4a.53.53 0 0 0-.4-.16h-1.55v2.15h1.55c.16 0 .3-.05.4-.16ZM22.66 0H1.34C.6 0 0 .6 0 1.34v21.32C0 23.4.6 24 1.34 24h21.32c.74 0 1.34-.6 1.34-1.34V1.34C24 .6 23.4 0 22.66 0ZM6.6 14.75c0 .78-.24 1.42-.72 1.9-.48.5-1.1.74-1.87.74H1.1V7.28h2.9c.78 0 1.4.25 1.88.74.48.49.72 1.12.72 1.9v4.83Zm5.42-5.86H9.34v2.2h1.64v1.6H9.34v2.2h2.68v1.6H8.7c-.3 0-.55-.1-.76-.32a1.04 1.04 0 0 1-.31-.76V8.37c0-.3.1-.55.31-.76.21-.21.46-.32.76-.32h3.32v1.6Zm6.9 6.63c-.24.6-.56.9-.98.9-.42 0-.75-.3-.98-.9L15.1 7.28h1.8l1.05 5.9 1.04-5.9h1.8l-1.87 8.24Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.05 4.13H5.08l12 15.64Z" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path d="M19 12H5m0 0 6-6m-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" />
    </svg>
  );
}

export function TranslateIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path
        d="M4 5h10M9 3v2m0 0c0 4.5-2.2 8-5 9m2-5c0 2.6 2.8 4.7 6 5M13 20l4-9 4 9m-6.6-2.2h5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  devto: DevIcon,
  x: XIcon,
} as const;
