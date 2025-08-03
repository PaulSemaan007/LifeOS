import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Target, Calendar, Star, CheckCircle } from 'lucide-react';
import { careerAPI } from '../../services/api';

interface CareerItem {
  id: number;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  target_date?: string;
  created_at: string;
}

const Career: React.FC = () => {
  const [items, setItems] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      const response = await careerAPI.getAll();
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching career data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#16a34a';
      case 'active':
        return '#2563eb';
      case 'paused':
        return '#d97706';
      default:
        return '#64748b';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'goal':
        return '#2563eb';
      case 'skill':
        return '#16a34a';
      case 'achievement':
        return '#d97706';
      case 'application':
        return '#dc2626';
      case 'interview':
        return '#7c3aed';
      default:
        return '#64748b';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return <Target size={16} />;
      case 'skill':
        return <Star size={16} />;
      case 'achievement':
        return <CheckCircle size={16} />;
      default:
        return <Briefcase size={16} />;
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return 'Critical';
      case 2:
        return 'High';
      case 3:
        return 'Medium';
      case 4:
        return 'Low';
      case 5:
        return 'Someday';
      default:
        return 'Medium';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return '#dc2626';
      case 2:
        return '#d97706';
      case 3:
        return '#2563eb';
      case 4:
        return '#16a34a';
      case 5:
        return '#64748b';
      default:
        return '#2563eb';
    }
  };

  if (loading) {
    return <div className="loading">Loading career data...</div>;
  }

  const activeItems = items.filter(item => item.status === 'active');
  const completedItems = items.filter(item => item.status === 'completed');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn-primary">
          <Plus size={16} />
          Add Career Item
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="dashboard-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Target size={20} style={{ color: '#2563eb' }} />
            <span style={{ fontWeight: '600' }}>Active Goals</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
            {activeItems.length}
          </div>
        </div>
        <div className="dashboard-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <CheckCircle size={20} style={{ color: '#16a34a' }} />
            <span style={{ fontWeight: '600' }}>Completed</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
            {completedItems.length}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
          <h3>No Career Items Yet</h3>
          <p>Start setting professional goals, tracking skills, and recording achievements.</p>
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
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: getTypeColor(item.type) + '20',
                      color: getTypeColor(item.type),
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {getTypeIcon(item.type)}
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
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: getPriorityColor(item.priority) + '20',
                      color: getPriorityColor(item.priority),
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {getPriorityText(item.priority)} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem'
                }}>
                  <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {item.description}
                  </p>
                </div>
              )}

              {/* Target Date */}
              {item.target_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                  <Calendar size={14} />
                  <span>Target: {new Date(item.target_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Career;