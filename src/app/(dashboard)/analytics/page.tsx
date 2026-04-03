import React from 'react';
import { PieChart, Activity } from 'lucide-react';
import { query } from '@/lib/db';
import AverageCharts from '../AverageCharts';
import DifficultiesChart from './DifficultiesChart';

export const metadata = {
  title: 'Analytiques | EduSaaS',
};

export default async function AnalyticsPage() {
  // Fetch all students to parse averages and difficulties
  const students = await query<any>(`
    SELECT s.*, c.name as class_name 
    FROM students s 
    JOIN classes c ON s.class_id = c.id
  `);

  // --- Parse Averages ---
  let high20 = 0, mid20 = 0, low20 = 0;
  let high10 = 0, mid10 = 0, low10 = 0;
  
  // --- Parse Difficulties ---
  let comp_orale = 0, ecriture = 0, vocab = 0, grammaire = 0, conjugaison = 0, prod_ecrite = 0;

  students.forEach(st => {
    // Calculate difficultes
    if (st.comprehension_orale) comp_orale++;
    if (st.ecriture) ecriture++;
    if (st.vocabulaire) vocab++;
    if (st.grammaire) grammaire++;
    if (st.conjugaison) conjugaison++;
    if (st.production_ecrite) prod_ecrite++;

    // Calculate Averages
    if (st.bio) {
      const match = st.bio.match(/(\d{1,2}\.\d{1,2})/);
      if (match && match[1]) {
        const avg = parseFloat(match[1]);
        const is1AM = st.class_name && st.class_name.startsWith('1AM');
        
        if (is1AM) {
          // Out of 10 logic
          if (avg >= 7) high10++;
          else if (avg >= 5) mid10++;
          else low10++;
        } else {
          // Out of 20 logic
          if (avg >= 14) high20++;
          else if (avg >= 10) mid20++;
          else low20++;
        }
      }
    }
  });

  const average20Data = [
    { name: 'Excellents (14+)', value: high20, color: 'var(--success, #10b981)' },
    { name: 'Moyens (10-13.99)', value: mid20, color: 'var(--warning, #f59e0b)' },
    { name: 'En difficulté (<10)', value: low20, color: 'var(--danger, #ef4444)' }
  ].filter(d => d.value > 0);

  const average10Data = [
    { name: 'Excellents (7+)', value: high10, color: 'var(--success, #10b981)' },
    { name: 'Moyens (5-6.99)', value: mid10, color: 'var(--warning, #f59e0b)' },
    { name: 'En difficulté (<5)', value: low10, color: 'var(--danger, #ef4444)' }
  ].filter(d => d.value > 0);

  const diffData = [
    { name: 'Comp. Orale', count: comp_orale },
    { name: 'Écriture', count: ecriture },
    { name: 'Vocabulaire', count: vocab },
    { name: 'Grammaire', count: grammaire },
    { name: 'Conjugaison', count: conjugaison },
    { name: 'Prod. Écrite', count: prod_ecrite }
  ].sort((a, b) => b.count - a.count); // sort to make it look like a nice funnel

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Activity size={28} style={{ color: 'var(--accent-primary)' }} />
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Analytiques Avancées</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Analysez les données de performance et de difficultés d'apprentissage.</p>
      </header>

      {/* Averages Section */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Moyennes Scolaires
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {average20Data.length > 0 ? (
          <AverageCharts data={average20Data} title="Répartition des Moyennes (Sur 20)" />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            Aucune donnée sur 20 détectée.
          </div>
        )}
        
        {average10Data.length > 0 ? (
          <AverageCharts data={average10Data} title="Répartition des Moyennes (Classes 1AM - Sur 10)" />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            Aucune donnée sur 10 détectée.
          </div>
        )}
      </div>

      {/* Difficulties Section */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
        Suivi des Parcours d'Apprentissage
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <DifficultiesChart data={diffData} />
      </div>
    </div>
  );
}
