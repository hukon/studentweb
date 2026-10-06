"use client";

import React from 'react';
import { Menu } from 'lucide-react';
import styles from './header.module.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

// Phone/tablet top bar only: on desktop the sidebar holds navigation, theme and logout.
export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={toggleSidebar} aria-label="Ouvrir le menu">
        <Menu size={22} />
      </button>
      <span className={styles.title}>Suivi des élèves</span>
    </header>
  );
}
