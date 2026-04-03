"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import styles from './header.module.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={toggleSidebar} aria-label="Toggle Navigation">
        <Menu size={24} />
      </button>

      <div className={styles.rightSection}>
        <button 
          className={styles.iconBtn} 
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className={styles.divider}></div>

        <button 
          className={styles.logoutBtn} 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={18} />
          <span>{isLoggingOut ? '...' : 'Déconnexion'}</span>
        </button>
      </div>
    </header>
  );
}
