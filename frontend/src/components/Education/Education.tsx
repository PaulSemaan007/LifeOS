import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { educationAPI } from '../../services/api';

interface EducationItem {
  id: number;
  title: string;
  type: string;
  status: string;
  progress: number;
  start_date?: string;
  target_date?: string;
  notes?: string;
  created_at: string;
}

const Education: React.FC = () => {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducationItems();
  }, []);

  const fetchEducationItems = async () => {
    try {
      const response = await educationAPI.getAll();
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching education items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#16a34a';
      case 'in-progress':
        return '#2563eb';
      case 'planned':
        return '#d97706';
      default:
        return '#64748b';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return '#16a34a';
    if (progress >= 50) return '#2563eb';
    if (progress >= 25) return '#d97706';
    return '#dc2626';
  };

  if (loading) {
    return <div className="loading">Loading education data...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn-primary">
          <Plus size={16} />
          Add Learning Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
          <h3>No Learning Items Yet</h3>
          <p>Start tracking your educational progress by adding courses, books, or skills you're learning.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} className="dashboard-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: '#f1f5f9', 
                      color: '#475569',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {item.type}
                    </span>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: getStatusColor(item.status) + '20',
                      color: getStatusColor(item.status),
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ 
                    padding: '0.5rem', 
                    background: 'none', 
                    border: 'none', 
                    color: '#64748b',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}>
                    <Edit size={16} />
                  </button>
                  <button style={{ 
                    padding: '0.5rem', 
                    background: 'none', 
                    border: 'none', 
                    color: '#dc2626',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Progress</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: getProgressColor(item.progress) }}>
                    {item.progress}%
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${item.progress}%`, 
                    height: '100%', 
                    backgroundColor: getProgressColor(item.progress),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Dates */}
              {(item.start_date || item.target_date) && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  {item.start_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                      <Calendar size={14} />
                      <span>Started: {new Date(item.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {item.target_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                      <TrendingUp size={14} />
                      <span>Target: {new Date(item.target_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {item.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;