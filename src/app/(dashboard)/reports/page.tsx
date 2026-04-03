"use client";

import React, { useState, useEffect } from 'react';
import { FileBox, Printer } from 'lucide-react';
import styles from './reports.module.css';

export default function ReportsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [reportType, setReportType] = useState('list'); // 'list' or 'evaluations'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) loadData();
  }, [selectedClass, reportType]);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const d = await res.json();
    setClasses(d);
    if (d.length > 0) setSelectedClass(d[0].id.toString());
    setIsLoading(false);
  };

  const loadData = async () => {
    setIsLoading(true);
    let endpoint = reportType === 'list' 
      ? `/api/students?classId=${selectedClass}` 
      : `/api/evaluations?classId=${selectedClass}`;
    
    const res = await fetch(endpoint);
    const d = await res.json();
    setData(d);
    setIsLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentClassName = classes.find(c => c.id.toString() === selectedClass)?.name || '';

  return (
    <div className={styles.container}>
      <header className={`${styles.header} no-print`}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>
            <FileBox size={28} className={styles.headerIcon} />
            <h1>Rapports & Export</h1>
          </div>
          <p className={styles.subtitle}>Générez des rapports PDF (via l'impression du navigateur).</p>
        </div>

        <div className={styles.headerActions}>
           <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className={styles.select}
            >
              <option value="list">Liste de présence</option>
              <option value="evaluations">Bilan d'évaluations</option>
            </select>
            
           <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className={styles.select}
            >
              {classes.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
            
          <button className={styles.printBtn} onClick={handlePrint} disabled={isLoading || data.length === 0}>
            <Printer size={18} />
            Imprimer / PDF
          </button>
        </div>
      </header>

      {/* Printable Area */}
      <div className={styles.printArea}>
        <div className={styles.printHeader}>
          <h2>{reportType === 'list' ? 'Liste d\'Appel' : 'Bilan d\'Évaluations'}</h2>
          <p>Classe : {currentClassName}</p>
        </div>

        {isLoading ? (
          <div className="no-print">Chargement...</div>
        ) : data.length === 0 ? (
          <div className="no-print">Aucune donnée disponible.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              {reportType === 'list' ? (
                <tr>
                  <th>Nom de l'étudiant</th>
                  <th>Présence</th>
                  <th>Signature / Notes</th>
                </tr>
              ) : (
                <tr>
                  <th>Nom de l'étudiant</th>
                  <th>Oral</th>
                  <th>Lecture</th>
                  <th>Compréhension</th>
                  <th>Production</th>
                  <th>Global</th>
                </tr>
              )}
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id || idx}>
                  {reportType === 'list' ? (
                    <>
                      <td>{item.name}</td>
                      <td></td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td>{item.student_name}</td>
                      <td>{item.oral_1 || '-'}</td>
                      <td>{item.reading_1 || '-'}</td>
                      <td>{item.comp_1 || '-'}</td>
                      <td>{item.prod_1 || '-'}</td>
                      <td><strong>{item.global_mastery || '-'}</strong></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
