import React, { useState } from 'react';
import { 
  BookOpen, 
  DollarSign, 
  Dumbbell, 
  Briefcase, 
  Home,
  Plus,
  BarChart3
} from 'lucide-react';
import './App.css';

// We'll create these components next
import Dashboard from './components/Dashboard/Dashboard';
import Education from './components/Education/Education';
import Finances from './components/Finances/Finances';
import Fitness from './components/Fitness/Fitness';
import Career from './components/Career/Career';

type ActiveView = 'dashboard' | 'education' | 'finances' | 'fitness' | 'career';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'career', label: 'Career', icon: Briefcase },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'education':
        return <Education />;
      case 'finances':
        return <Finances />;
      case 'fitness':
        return <Fitness />;
      case 'career':
        return <Career />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">LifeOS</h1>
          <p className="tagline">Your Personal Operating System</p>
        </div>
        
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h2 className="page-title">
            {navigation.find(item => item.id === activeView)?.label || 'Dashboard'}
          </h2>
          <div className="header-actions">
            <button className="btn-primary">
              <Plus size={16} />
              Quick Add
            </button>
          </div>
        </header>
        
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;