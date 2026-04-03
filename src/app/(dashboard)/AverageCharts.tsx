"use client";

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

export default function AverageCharts({
  data,
  title = "Répartition des Moyennes"
}: {
  data: { name: string; value: number; color: string }[];
  title?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: 300, width: '100%', backgroundColor: 'var(--bg-card)', borderRadius: '12px', opacity: 0.5 }} />;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
      <div style={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
