"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion');
      } else {
        router.push(data.redirect || '/');
        router.refresh();
      }
    } catch (err) {
      setError('Connexion impossible. Vérifiez votre réseau et réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}><GraduationCap size={28} /></div>
          <h1 className={styles.title}>Suivi des élèves</h1>
          <p className={styles.subtitle}>
            Connectez-vous pour accéder à vos classes.
          </p>
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">Nom d'utilisateur</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input
                id="username"
                type="text"
                className={styles.input}
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Mot de passe</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isLoading || !username || !password}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
