import { Container } from '@/components/ui/Container';
import styles from './PageHeader.module.css';

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className={styles.header}>
      <Container>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
      </Container>
    </header>
  );
}
