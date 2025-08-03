import React, { useState, useEffect } from 'react';
import { BookOpen, DollarSign, Dumbbell, Briefcase, TrendingUp } from 'lucide-react';
import { educationAPI, financesAPI, fitnessAPI, careerAPI } from '../../services/api';

interface DashboardData {
  education: any[];
  finances: any[];
  fitness: any[];
  career: any[];
  financeSummary: any[];
  fitnessStats: any[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [education, finances, fitness, career, financeSummary, fitnessStats] = await Promise.all([
          educationAPI.getAll(),
          financesAPI.getAll(),
          fitnessAPI.getAll(),
          careerAPI.getAll(),
          financesAPI.getSummary(),
          fitnessAPI.getStats(),
        ]);

        setData({
          education: education.data.data,
          finances: finances.data.data,
          fitness: fitness.data.data,
          career: career.data.data,
          financeSummary: financeSummary.data.summary,
          fitnessStats: fitnessStats.data.stats,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading your LifeOS dashboard...</div>;
  }

  if (!data) {
    return <div className="loading">Unable to load dashboard data</div>;
  }

  // Calculate some stats
  const inProgressEducation = data.education.filter(item => item.status === 'in-progress').length;
  const completedEducation = data.education.filter(item => item.status === 'completed').length;
  const totalExpenses = data.finances
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalIncome = data.finances
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const activeCareerGoals = data.career.filter(item => item.status === 'active').length;
  const totalWorkouts = data.fitness.filter(item => item.type === 'workout').length;

  return (
    <div>
      <div className="dashboard-grid">
        {/* Education Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon education">
              <BookOpen size={24} />
            </div>
            <h3 className="card-title">Education</h3>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{inProgressEducation}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{completedEducation}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            {data.education.length > 0 ? (
              <div style={{ marginTop: '1rem' }}>
                <strong>Recent:</strong> {data.education[0].title}
              </div>
            ) : (
              <div style={{ marginTop: '1rem', color: '#9ca3af' }}>
                No education items yet. Start learning something new!
              </div>
            )}
          </div>
        </div>

        {/* Finances Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon finances">
              <DollarSign size={24} />
            </div>
            <h3 className="card-title">Finances</h3>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">${totalIncome.toFixed(2)}</div>
                <div className="stat-label">Income</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">${totalExpenses.toFixed(2)}</div>
                <div className="stat-label">Expenses</div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ 
                color: totalIncome - totalExpenses >= 0 ? '#16a34a' : '#dc2626',
                fontWeight: 'bold'
              }}>
                Net: ${(totalIncome - totalExpenses).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Fitness Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon fitness">
              <Dumbbell size={24} />
            </div>
            <h3 className="card-title">Fitness</h3>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{totalWorkouts}</div>
                <div className="stat-label">Workouts</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.fitnessStats.length}</div>
                <div className="stat-label">Activities</div>
              </div>
            </div>
            {data.fitness.length > 0 ? (
              <div style={{ marginTop: '1rem' }}>
                <strong>Latest:</strong> {data.fitness[0].activity} 
                {data.fitness[0].value && ` - ${data.fitness[0].value} ${data.fitness[0].unit}`}
              </div>
            ) : (
              <div style={{ marginTop: '1rem', color: '#9ca3af' }}>
                No fitness records yet. Time to get moving!
              </div>
            )}
          </div>
        </div>

        {/* Career Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon career">
              <Briefcase size={24} />
            </div>
            <h3 className="card-title">Career</h3>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{activeCareerGoals}</div>
                <div className="stat-label">Active Goals</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.career.length}</div>
                <div className="stat-label">Total Items</div>
              </div>
            </div>
            {data.career.length > 0 ? (
              <div style={{ marginTop: '1rem' }}>
                <strong>Priority:</strong> {data.career[0].title}
              </div>
            ) : (
              <div style={{ marginTop: '1rem', color: '#9ca3af' }}>
                No career goals yet. Set your professional targets!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="dashboard-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <TrendingUp size={24} />
          </div>
          <h3 className="card-title">Quick Overview</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div className="stat-item">
              <div className="stat-value">{data.education.length + data.finances.length + data.fitness.length + data.career.length}</div>
              <div className="stat-label">Total Records</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{inProgressEducation + activeCareerGoals}</div>
              <div className="stat-label">Active Items</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{totalWorkouts}</div>
              <div className="stat-label">This Period</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;