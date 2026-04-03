"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  LayoutGrid, 
  Calendar, 
  FileBox, 
  X
} from 'lucide-react';
import styles from './sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/' },
    { label: 'Classes & Étudiants', icon: Users, href: '/classes' },
    { label: 'Évaluations', icon: GraduationCap, href: '/evaluations' },
    { label: 'Plan de Classe', icon: LayoutGrid, href: '/seating' },
    { label: 'Calendrier Scolaire', icon: Calendar, href: '/calendar' },
    { label: 'Rapports & Export', icon: FileBox, href: '/reports' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.icon}>📚</div>
          <span className={styles.title}>EduSaaS</span>
        </div>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <item.icon size={20} className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
