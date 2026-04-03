"use client";

import React, { useState, useEffect } from 'react';
import { GraduationCap, Save, TrendingUp, AlertCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import styles from './evaluations.module.css';

export default function EvaluationsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [showCharts, setShowCharts] = useState(false);

  const columns = [
    { key: 'oral_1', label: 'Or 1' }, { key: 'oral_2', label: 'Or 2' }, { key: 'oral_3', label: 'Or 3' },
    { key: 'reading_1', label: 'Lec 1' }, { key: 'reading_2', label: 'Lec 2' }, { key: 'reading_3', label: 'Lec 3' },
    { key: 'comp_1', label: 'Comp 1' }, { key: 'comp_2', label: 'Comp 2' }, { key: 'comp_3', label: 'Comp 3' },
    { key: 'prod_1', label: 'Prod 1' }, { key: 'prod_2', label: 'Prod 2' }, { key: 'prod_3', label: 'Prod 3' }, { key: 'prod_4', label: 'Prod 4' },
    { key: 'global_mastery', label: 'Global' }
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadEvaluations(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
    if (data.length > 0) setSelectedClass(data[0].id.toString());
    setIsLoading(false);
  };

  const loadEvaluations = async (classId: string) => {
    setIsLoading(true);
    const res = await fetch(`/api/evaluations?classId=${classId}`);
    const data = await res.json();
    setEvaluations(data);
    setIsLoading(false);
  };

  const handleCellChange = (studentId: number, colKey: string, value: string) => {
    const newEvals = [...evaluations];
    const index = newEvals.findIndex(e => (e.student_id || e.id) === studentId); // e.id is student id if no eval record existed
    if (index !== -1) {
      newEvals[index][colKey] = value.toUpperCase();
      setEvaluations(newEvals);
    }
  };

  const saveEvaluations = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = evaluations.map(e => ({
        ...e,
        student_id: e.student_id || e.id // fallback needed based on sql outer join
      }));

      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluations: payload })
      });

      if (!res.ok) throw new Error();
      setMessage({ text: 'Évaluations sauvegardées !', type: 'success' });
    } catch (e) {
      setMessage({ text: 'Erreur lors de la sauvegarde.', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Generate chart data purely based on A, B, C, D occurrences mapped to groups
  const generateChartData = () => {
    let countA = 0; let countB = 0; let countC = 0; let countD = 0;
    
    evaluations.forEach(ev => {
      columns.forEach(col => {
        const val = ev[col.key];
        if (val === 'A') countA++;
        if (val === 'B') countB++;
        if (val === 'C') countC++;
        if (val === 'D') countD++;
      });
    });

    return [
      { name: 'Maîtrise Très Satisfaisante (A)', count: countA, fill: 'var(--success)' },
      { name: 'Satisfaisante (B)', count: countB, fill: 'var(--accent-primary)' },
      { name: 'Fragile (C)', count: countC, fill: 'var(--warning)' },
      { name: 'Insuffisante (D)', count: countD, fill: 'var(--danger)' },
    ];
  };

  if (isLoading) return <div className={styles.loader}>Chargement des évaluations...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>
            <GraduationCap size={28} className={styles.headerIcon} />
            <h1>Évaluations & Notes</h1>
          </div>
          <p className={styles.subtitle}>Saisie rapide type tableur. Tapez A, B, C, ou D.</p>
        </div>

        <div className={styles.headerActions}>
           <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className={styles.classSelect}
            >
              {classes.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
            
          <button className={styles.chartBtn} onClick={() => setShowCharts(!showCharts)}>
            <TrendingUp size={18} />
            {showCharts ? 'Masquer Graphes' : 'Analytique'}
          </button>
          
          <button className={styles.saveBtn} onClick={saveEvaluations} disabled={isSaving}>
            <Save size={18} />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      {message && (
        <div className={`${styles.messageBanner} ${message.type === 'success' ? styles.success : styles.error}`}>
          <AlertCircle size={18} /> {message.text}
        </div>
      )}

      {showCharts && (
        <div className={styles.chartSection}>
          <h2 className={styles.chartTitle}>Répartition Globale des Compétences</h2>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generateChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis tick={{fill: 'var(--text-secondary)'}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className={styles.spreadsheetWrapper}>
        <table className={styles.spreadsheet}>
          <thead>
            <tr>
              <th className={styles.stickyCol}>Étudiant</th>
              {columns.map(col => (
                <th key={col.key} title={col.label}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {evaluations.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className={styles.emptyState}>Aucun étudiant trouvé.</td>
              </tr>
            ) : (
              evaluations.map((ev) => (
                <tr key={ev.student_id || ev.id}>
                  <td className={styles.stickyCol}>
                    <span className={styles.studentName}>{ev.student_name}</span>
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className={styles.cell}>
                      <input 
                        type="text" 
                        maxLength={2}
                        className={styles.cellInput}
                        value={ev[col.key] || ''}
                        onChange={(e) => handleCellChange(ev.student_id || ev.id, col.key, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
