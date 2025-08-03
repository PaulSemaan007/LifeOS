import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  GraduationCap, 
  Award, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  ArrowRight,
  BarChart3,
  Users,
  BookMarked
} from 'lucide-react';

// TypeScript interfaces
interface Program {
  id: number;
  name: string;
  type: string;
  institution: string;
  status: string;
  total_credits?: number;
  credits_completed: number;
  credits_earned: number;
  completed_courses: number;
  start_date?: string;
  target_completion_date?: string;
  completion_date?: string;
  gpa?: number;
  notes?: string;
  created_at: string;
}

interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  description?: string;
  institution?: string;
  prerequisites?: string;
  created_at: string;
}

interface Completion {
  id: number;
  course_id: number;
  program_id?: number;
  code: string;
  course_name: string;
  credits: number;
  program_name?: string;
  program_type?: string;
  semester?: string;
  year?: number;
  grade?: string;
  grade_points?: number;
  status: string;
  completion_date?: string;
  notes?: string;
  created_at: string;
}

interface Stats {
  programs?: Array<{
    type: string;
    count: number;
    completed: number;
    in_progress: number;
  }>;
  gpa?: Array<{
    program_name: string;
    gpa?: number;
    calculated_gpa?: number;
  }>;
  recent_completions?: Array<{
    code: string;
    name: string;
    grade?: string;
    semester?: string;
    year?: number;
  }>;
}

// Enhanced API service for the new education system
const educationAPI = {
  // Programs
  getPrograms: () => fetch('http://localhost:5000/api/education/programs').then(r => r.json()),
  getProgram: (id: number) => fetch(`http://localhost:5000/api/education/programs/${id}`).then(r => r.json()),
  createProgram: (data: any) => fetch('http://localhost:5000/api/education/programs', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  
  // Courses
  getCourses: () => fetch('http://localhost:5000/api/education/courses').then(r => r.json()),
  createCourse: (data: any) => fetch('http://localhost:5000/api/education/courses', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  
  // Completions
  getCompletions: () => fetch('http://localhost:5000/api/education/completions').then(r => r.json()),
  createCompletion: (data: any) => fetch('http://localhost:5000/api/education/completions', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  
  // Stats
  getStats: () => fetch('http://localhost:5000/api/education/stats').then(r => r.json()),
};

const Education = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'courses' | 'completions'>('overview');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, coursesRes, completionsRes, statsRes] = await Promise.all([
        educationAPI.getPrograms(),
        educationAPI.getCourses(),
        educationAPI.getCompletions(),
        educationAPI.getStats()
      ]);
      
      setPrograms(programsRes.data || []);
      setCourses(coursesRes.data || []);
      setCompletions(completionsRes.data || []);
      setStats(statsRes);
    } catch (error) {
      console.error('Error fetching education data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certification': return <Award size={20} />;
      case 'associate': return <BookOpen size={20} />;
      case 'bachelor': return <GraduationCap size={20} />;
      case 'master': return <GraduationCap size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'certification': return '#d97706';
      case 'associate': return '#2563eb';
      case 'bachelor': return '#16a34a';
      case 'master': return '#7c3aed';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'in-progress': return '#2563eb';
      case 'planned': return '#d97706';
      case 'paused': return '#dc2626';
      default: return '#64748b';
    }
  };

  const calculateProgress = (program: Program) => {
    if (!program.total_credits) return 0;
    return Math.round((program.credits_earned / program.total_credits) * 100);
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return '#64748b';
    if (grade.includes('A')) return '#16a34a';
    if (grade.includes('B')) return '#2563eb';
    if (grade.includes('C')) return '#d97706';
    if (grade.includes('D')) return '#dc2626';
    return '#64748b';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '3rem',
        color: '#64748b' 
      }}>
        Loading education data...
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem'
      }}>
        {[
          { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
          { id: 'programs' as const, label: 'Programs', icon: GraduationCap },
          { id: 'courses' as const, label: 'Courses', icon: BookOpen },
          { id: 'completions' as const, label: 'Completions', icon: CheckCircle }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: activeTab === tab.id ? '#3b82f6' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            {/* Programs Summary */}
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: '#ddd6fe',
                  color: '#7c3aed'
                }}>
                  <GraduationCap size={20} />
                </div>
                <span style={{ fontWeight: '600' }}>Educational Programs</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                {programs.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {programs.filter(p => p.status === 'completed').length} completed, {programs.filter(p => p.status === 'in-progress').length} in progress
              </div>
            </div>

            {/* Courses Summary */}
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: '#dcfce7',
                  color: '#16a34a'
                }}>
                  <BookOpen size={20} />
                </div>
                <span style={{ fontWeight: '600' }}>Courses Completed</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                {completions.filter(c => c.status === 'completed').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {completions.reduce((sum, c) => sum + (c.credits || 0), 0)} total credits earned
              </div>
            </div>

            {/* GPA Summary */}
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: '#fef3c7',
                  color: '#d97706'
                }}>
                  <Target size={20} />
                </div>
                <span style={{ fontWeight: '600' }}>Average GPA</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                {stats?.gpa?.[0]?.calculated_gpa?.toFixed(2) || 'N/A'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Based on completed courses
              </div>
            </div>
          </div>

          {/* Programs List */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
              Your Educational Programs
            </h3>
            
            {programs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <GraduationCap size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  No Educational Programs Yet
                </h4>
                <p>Start by adding your degree programs, certifications, or courses you're pursuing.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {programs.map(program => (
                  <div key={program.id} style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <div style={{ 
                            padding: '0.5rem', 
                            borderRadius: '0.375rem', 
                            backgroundColor: getTypeColor(program.type) + '20',
                            color: getTypeColor(program.type)
                          }}>
                            {getTypeIcon(program.type)}
                          </div>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
                            {program.name}
                          </h4>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            backgroundColor: getStatusColor(program.status) + '20',
                            color: getStatusColor(program.status),
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>
                            {program.status}
                          </span>
                          {program.institution && (
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                              {program.institution}
                            </span>
                          )}
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {program.completed_courses} courses completed
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {program.total_credits && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Credit Progress</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                            {program.credits_earned} / {program.total_credits} credits ({calculateProgress(program)}%)
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
                            width: `${calculateProgress(program)}%`, 
                            height: '100%', 
                            backgroundColor: getStatusColor(program.status),
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                      {program.start_date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={12} />
                          Started: {new Date(program.start_date).toLocaleDateString()}
                        </div>
                      )}
                      {program.target_completion_date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Target size={12} />
                          Target: {new Date(program.target_completion_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Completions */}
          {completions.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              border: '1px solid #e2e8f0',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                Recent Course Completions
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {completions.slice(0, 5).map(completion => (
                  <div key={completion.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {completion.code} - {completion.course_name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {completion.semester} {completion.year} • {completion.credits} credits
                      </div>
                    </div>
                    {completion.grade && (
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getGradeColor(completion.grade) + '20',
                        color: getGradeColor(completion.grade),
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {completion.grade}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              <Plus size={16} />
              Add Educational Program
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {programs.map(program => (
              <div key={program.id} style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      padding: '1rem', 
                      borderRadius: '0.5rem', 
                      backgroundColor: getTypeColor(program.type) + '20',
                      color: getTypeColor(program.type)
                    }}>
                      {getTypeIcon(program.type)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                        {program.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: getStatusColor(program.status) + '20',
                          color: getStatusColor(program.status),
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {program.status}
                        </span>
                        {program.institution && (
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {program.institution}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                      {program.completed_courses}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Courses Completed</div>
                  </div>
                  {program.total_credits && (
                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                        {program.credits_earned}/{program.total_credits}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Credits</div>
                    </div>
                  )}
                  {program.gpa && (
                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                        {program.gpa.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>GPA</div>
                    </div>
                  )}
                </div>

                {program.notes && (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    marginTop: '1rem'
                  }}>
                    <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                      {program.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs would go here... */}
      {activeTab === 'courses' && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <BookMarked size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
          <h3>Courses Management</h3>
          <p>Course management interface coming soon...</p>
        </div>
      )}

      {activeTab === 'completions' && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
          <h3>Course Completions</h3>
          <p>Completion tracking interface coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Education;