import React from 'react';
import { query } from '@/lib/db';
import AverageCharts from '../AverageCharts';
import DashboardCharts from '../DashboardCharts'; // Used for generic bar charts

export const metadata = {
  title: 'Analytiques | EduSaaS',
};

export default async function AnalyticsPage() {
  // Fetch class data
  const chartDataRaw = await query<{name: string; count: number}>(`
    SELECT c.name, COUNT(s.id) as count
    FROM classes c
    LEFT JOIN students s ON c.id = s.class_id
    GROUP BY c.id, c.name
  `);
  
  const classDistData = chartDataRaw.map(row => ({
    name: row.name,
    students: Number(row.count)
  }));

  // Fetch all students for averages and difficulties
  // Include class name to distinguish 1AM
  const allStudents = await query<{
    bio: string; 
    class_name: string;
    comprehension_orale: boolean | number;
    ecriture: boolean | number;
    vocabulaire: boolean | number;
    grammaire: boolean | number;
    conjugaison: boolean | number;
    production_ecrite: boolean | number;
  }>(`
    SELECT s.bio, c.name as class_name, 
           s.comprehension_orale, s.ecriture, s.vocabulaire, 
           s.grammaire, s.conjugaison, s.production_ecrite
    FROM students s
    JOIN classes c ON s.class_id = c.id
  `);

  // --- SEPARATE AVERAGES ---
  let high20 = 0, mid20 = 0, low20 = 0; // Out of 20
  let high10 = 0, mid10 = 0, low10 = 0; // Out of 10 (1AM)

  // --- DIFFICULTIES ---
  let diffComprehension = 0;
  let diffEcriture = 0;
  let diffVocabulaire = 0;
  let diffGrammaire = 0;
  let diffConjugaison = 0;
  let diffProduction = 0;

  allStudents.forEach(st => {
    // 1. Tally difficulties
    if (st.comprehension_orale) diffComprehension++;
    if (st.ecriture) diffEcriture++;
    if (st.vocabulaire) diffVocabulaire++;
    if (st.grammaire) diffGrammaire++;
    if (st.conjugaison) diffConjugaison++;
    if (st.production_ecrite) diffProduction++;

    // 2. Tally Averages
    if (st.bio) {
      const match = st.bio.match(/(\d{1,2}\.\d{1,2})/);
      if (match && match[1]) {
        const avg = parseFloat(match[1]);
        if (st.class_name.includes('1AM')) {
          // Average is out of 10
          if (avg >= 7) high10++;
          else if (avg >= 5) mid10++;
          else low10++;
        } else {
          // Average is out of 20
          if (avg >= 14) high20++;
          else if (avg >= 10) mid20++;
          else low20++;
        }
      }
    }
  });

  const avgData20 = [
    { name: 'Excellents (14+)', value: high20, color: 'var(--success, #10b981)' },
    { name: 'Moyens (10-13.99)', value: mid20, color: 'var(--warning, #f59e0b)' },
    { name: 'En difficulté (<10)', value: low20, color: 'var(--danger, #ef4444)' }
  ].filter(d => d.value > 0);

  const avgData10 = [
    { name: 'Excellents (7+)', value: high10, color: 'var(--success, #10b981)' },
    { name: 'Moyens (5-6.99)', value: mid10, color: '#3b82f6' }, // Blue to distinguish
    { name: 'En difficulté (<5)', value: low10, color: 'var(--danger, #ef4444)' }
  ].filter(d => d.value > 0);

  const difficultiesData = [
    { name: 'C. Orale', students: diffComprehension },
    { name: 'Écriture', students: diffEcriture },
    { name: 'Vocab', students: diffVocabulaire },
    { name: 'Grammaire', students: diffGrammaire },
    { name: 'Conjug', students: diffConjugaison },
    { name: 'P. Écrite', students: diffProduction },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Rapports Analytiques</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Statistiques globales de réussite et difficultés des étudiants.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Averages for standard classes */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Moyennes Globales (sur 20)</h2>
          {avgData20.length > 0 ? (
            <AverageCharts data={avgData20} />
          ) : (
             <div style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', marginTop: '1rem', color: 'var(--text-muted)' }}>Aucune donnée disponible.</div>
          )}
        </div>

        {/* Averages for 1AM */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Moyennes 1AM (sur 10)</h2>
          {avgData10.length > 0 ? (
            <AverageCharts data={avgData10} />
          ) : (
            <div style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', marginTop: '1rem', color: 'var(--text-muted)' }}>Aucune donnée disponible.</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Difficulties Bar Chart */}
        <div>
           <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Difficultés d'Apprentissage</h2>
           <DashboardCharts data={difficultiesData} />
        </div>
        
        {/* Class Distribution fallback */}
        <div>
           <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Élèves par Classe</h2>
           <DashboardCharts data={classDistData} />
        </div>
      </div>

    </div>
  );
}
