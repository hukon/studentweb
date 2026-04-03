import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  GraduationCap, 
  LayoutGrid, 
  Calendar, 
  FileBox, 
  Clock 
} from 'lucide-react';
import { querySingle } from '@/lib/db';
import styles from './dashboard.module.css';

export const metadata = {
  title: 'Tableau de bord | EduSaaS',
};

async function getStats() {
  try {
    const studentData = await querySingle<{ count: number }>('SELECT COUNT(*) as count FROM students');
    const classData = await querySingle<{ count: number }>('SELECT COUNT(*) as count FROM classes');
    
    return {
      students: studentData?.count || 0,
      classes: classData?.count || 0
    };
  } catch(e) {
    return { students: 0, classes: 0 };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { title: 'Classes & Étudiants', icon: Users, href: '/classes', desc: 'Gérer les profils et listes.', color: 'var(--accent-primary)', bg: 'var(--accent-light)' },
    { title: 'Évaluations', icon: GraduationCap, href: '/evaluations', desc: 'Saisir les notes et compétences.', color: 'var(--success)', bg: 'var(--success-light)' },
    { title: 'Plan de Classe', icon: LayoutGrid, href: '/seating', desc: 'Organiser les places.', color: 'var(--warning)', bg: 'var(--warning-light)' },
    { title: 'Calendrier', icon: Calendar, href: '/calendar', desc: 'Événements et jours fériés.', color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Rapports', icon: FileBox, href: '/reports', desc: 'Générer des PDF et listes.', color: '#ec4899', bg: '#fdf2f8' },
    { title: 'Emploi du temps', icon: Clock, href: '/schedule', desc: 'Voir les horaires.', color: '#14b8a6', bg: '#f0fdfa' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Vue d'ensemble</h1>
        <p className={styles.subtitle}>Supervisez vos classes et vos élèves d'un coup d'œil.</p>
      </header>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Étudiants</p>
            <h2 className={styles.statValue}>{stats.students}</h2>
          </div>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
            <Users size={24} />
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Classes Actives</p>
            <h2 className={styles.statValue}>{stats.classes}</h2>
          </div>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <LayoutGrid size={24} />
          </div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Accès Rapide</h2>
      <div className={styles.actionsGrid}>
        {cards.map((card, idx) => (
          <Link href={card.href} key={idx} className={styles.actionCard}>
            <div className={styles.iconWrapper} style={{ backgroundColor: card.bg, color: card.color }}>
              <card.icon size={28} />
            </div>
            <div className={styles.cardContent}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
