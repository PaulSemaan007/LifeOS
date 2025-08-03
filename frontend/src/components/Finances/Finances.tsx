import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { financesAPI } from '../../services/api';

interface FinanceItem {
  id: number;
  type: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

const Finances: React.FC = () => {
  const [items, setItems] = useState<FinanceItem[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      const [itemsResponse, summaryResponse] = await Promise.all([
        financesAPI.getAll(),
        financesAPI.getSummary()
      ]);
      setItems(itemsResponse.data.data);
      setSummary(summaryResponse.data.summary);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return '#16a34a';
      case 'expense':
        return '#dc2626';
      case 'investment':
        return '#2563eb';
      case 'saving':
        return '#d97706';
      default:
        return '#64748b';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp size={16} />;
      case 'expense':
        return <TrendingDown size={16} />;
      default:
        return <DollarSign size={16} />;
    }
  };

  if (loading) {
    return <div className="loading">Loading finance data...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn-primary">
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      {summary.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {summary.map((item, index) => (
            <div key={index} className="dashboard-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: getTypeColor(item.type) + '20',
                  color: getTypeColor(item.type)
                }}>
                  {getTypeIcon(item.type)}
                </div>
                <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{item.type}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                ${parseFloat(item.total).toFixed(2)}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {item.count} transactions
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <DollarSign size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
          <h3>No Financial Records Yet</h3>
          <p>Start tracking your income, expenses, investments, and savings.</p>
        </div>
      ) : (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
            Recent Transactions
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
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>
                      {item.description || item.category}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {item.category} • {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600',
                  color: item.type === 'income' ? '#16a34a' : '#dc2626'
                }}>
                  {item.type === 'income' ? '+' : '-'}${parseFloat(item.amount.toString()).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Finances;