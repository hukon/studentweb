"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  LayoutGrid,
  Calendar,
  CalendarClock,
  FileBox,
  PieChart,
  GraduationCap as BrandIcon,
  Moon,
  Sun,
  LogOut,
  X
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import styles from './sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navGroups = [
  {
    label: null,
    items: [{ label: 'Tableau de bord', icon: LayoutDashboard, href: '/' }],
  },
  {
    label: 'Ma classe',
    items: [
      { label: 'Classes & Étudiants', icon: Users, href: '/classes' },
      { label: 'Plan de classe', icon: LayoutGrid, href: '/seating' },
      { label: 'Évaluations', icon: GraduationCap, href: '/evaluations' },
    ],
  },
  {
    label: 'Planning',
    items: [
      { label: 'Emploi du temps', icon: CalendarClock, href: '/schedule' },
      { label: 'Calendrier scolaire', icon: Calendar, href: '/calendar' },
    ],
  },
  {
    label: 'Bilans',
    items: [
      { label: 'Analytiques', icon: PieChart, href: '/analytics' },
      { label: 'Rapports & export', icon: FileBox, href: '/reports' },
    ],
  },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.icon}>
            <BrandIcon size={18} />
          </div>
          <span className={styles.title}>Suivi des élèves</span>
        </div>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Fermer le menu">
          <X size={22} />
        </button>
      </div>

      <nav className={styles.nav} aria-label="Navigation principale">
        {navGroups.map((group, i) => (
          <div key={i} className={styles.group}>
            {group.label && <p className={styles.groupLabel}>{group.label}</p>}
            {group.items.map(item => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={18} className={styles.navIcon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.footerBtn} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
        </button>
        <button className={styles.footerBtn} onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut size={18} />
          <span>{isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}</span>
        </button>
      </div>
    </aside>
  );
}
