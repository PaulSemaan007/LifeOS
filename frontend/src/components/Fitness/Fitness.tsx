import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Activity, Calendar, Target } from 'lucide-react';
import { fitnessAPI } from '../../services/api';

interface FitnessItem {
  id: number;
  type: string;
  activity: string;
  value: number;
  unit: string;
  notes?: string;
  date: string;
  created_at: string;
}

const Fitness: React.FC = () => {
  const [items, setItems] = useState<FitnessItem[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFitnessData();
  }, []);

  const fetchFitnessData = async () => {
    try {
      const [itemsResponse, statsResponse] = await Promise.all([
        fitnessAPI.getAll(),
        fitnessAPI.getStats()
      ]);
      setItems(itemsResponse.data.data);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Error fetching fitness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workout':
        return '#dc2626';
      case 'weight':
        return '#2563eb';
      case 'measurement':
        return '#16a34a';
      case 'goal':
        return '#d97706';
      default:
        return '#64748b';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <Dumbbell size={16} />;
      case 'weight':
        return <Target size={16} />;
      case 'measurement':
        return <Activity size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  if (loading) {
    return <div className="loading">Loading fitness data...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn-primary">
          <Plus size={16} />
          Log Activity
        </button>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {stats.slice(0, 4).map((stat, index) => (
            <div key={index} className="dashboard-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: getTypeColor(stat.type) + '20',
                  color: getTypeColor(stat.type)
                }}>
                  {getActivityIcon(stat.type)}
                </div>
                <span style={{ fontWeight: '600' }}>{stat.activity}</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                {stat.avg_value ? parseFloat(stat.avg_value).toFixed(1) : '-'} {stat.unit}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {stat.sessions} sessions
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <Dumbbell size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
          <h3>No Fitness Records Yet</h3>
          <p>Start tracking your workouts, measurements, and fitness goals.</p>
        </div>
      ) : (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
            Recent Activities
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    borderRadius: '0.5rem', 
                    backgroundColor: getTypeColor(item.type) + '20',
                    color: getTypeColor(item.type)
                  }}>
                    {getActivityIcon(item.type)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>
                      {item.activity}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={12} />
                      {new Date(item.date).toLocaleDateString()}
                      {item.notes && ` • ${item.notes}`}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600',
                  color: getTypeColor(item.type),
                  textAlign: 'right'
                }}>
                  {item.value && (
                    <>
                      {item.value} {item.unit}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fitness;