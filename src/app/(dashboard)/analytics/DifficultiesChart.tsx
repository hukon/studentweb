"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

export default function DifficultiesChart({
  data
}: {
  data: { name: string; count: number; color?: string }[]
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: 350, width: '100%', backgroundColor: 'var(--bg-card)', borderRadius: '12px', opacity: 0.5 }} />;

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#14b8a6'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 600 }}>Difficultés d'apprentissage globales</h3>
      <div style={{ height: 350, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
