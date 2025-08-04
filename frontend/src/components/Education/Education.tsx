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
  BookMarked,
  Edit,
  Settings
} from 'lucide-react';

// Import the forms and enhanced management
import { AddProgramForm, AddCompletionForm, QuickAddCourseForm } from './EducationForms';
import ProgramManagementModal from './ProgramManagementModal';

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
  updateProgram: (id: number, data: any) => fetch(`http://localhost:5000/api/education/programs/${id}`, { 
    method: 'PUT', 
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
  
  // Program Requirements
  getProgramRequirements: (programId: number) => fetch(`http://localhost:5000/api/education/programs/${programId}/requirements`).then(r => r.json()),
  addProgramRequirement: (programId: number, data: any) => fetch(`http://localhost:5000/api/education/programs/${programId}/requirements`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  removeProgramRequirement: (programId: number, requirementId: number) => fetch(`http://localhost:5000/api/education/programs/${programId}/requirements/${requirementId}`, { 
    method: 'DELETE' 
  }).then(r => r.json()),
  
  // Prerequisites
  addPrerequisite: (courseId: number, prerequisiteId: number) => fetch(`http://localhost:5000/api/education/courses/${courseId}/prerequisites`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ prerequisite_course_id: prerequisiteId }) 
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

  // Modal states
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showAddCompletion, setShowAddCompletion] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showManageProgram, setShowManageProgram] = useState(false);
  const [selectedProgramForManagement, setSelectedProgramForManagement] = useState<Program | null>(null);

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

  // Form handlers
  const handleAddProgram = async (programData: any) => {
    try {
      await educationAPI.createProgram(programData);
      await fetchData(); // Refresh data
      console.log('Program added successfully!');
    } catch (error) {
      console.error('Error adding program:', error);
      throw error;
    }
  };

  const handleManageProgram = (program: Program) => {
    setSelectedProgramForManagement(program);
    setShowManageProgram(true);
  };

  const handleCloseManageProgram = () => {
    setShowManageProgram(false);
    setSelectedProgramForManagement(null);
  };

  const handleAddCourse = async (courseData: any) => {
    try {
      await educationAPI.createCourse(courseData);
      await fetchData(); // Refresh data
      console.log('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  };

  const handleAddCompletion = async (completionData: any) => {
    try {
      await educationAPI.createCompletion(completionData);
      await fetchData(); // Refresh data
      console.log('Completion added successfully!');
    } catch (error) {
      console.error('Error adding completion:', error);
      throw error;
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

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setShowAddProgram(true)}
          style={{
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
          }}
        >
          <Plus size={16} />
          Add Program
        </button>
        
        <button 
          onClick={() => setShowAddCompletion(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <CheckCircle size={16} />
          Record Completion
        </button>

        <button 
          onClick={() => setShowAddCourse(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#d97706',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <BookOpen size={16} />
          Add Course
        </button>
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
                <button 
                  onClick={() => setShowAddProgram(true)}
                  style={{
                    marginTop: '1rem',
                    display: 'inline-flex',
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
                  }}
                >
                  <Plus size={16} />
                  Add Your First Program
                </button>
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
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => handleManageProgram(program)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#f8fafc',
                          color: '#3b82f6',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#3b82f6';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.color = '#3b82f6';
                        }}
                      >
                        <Settings size={16} />
                        Manage
                      </button>
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

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
              Course Catalog
            </h3>
            
            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <BookOpen size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  No Courses Yet
                </h4>
                <p>Add courses to build your academic catalog.</p>
                <button 
                  onClick={() => setShowAddCourse(true)}
                  style={{
                    marginTop: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#d97706',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                  Add Your First Course
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {courses.map(course => (
                  <div key={course.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {course.code}
                        </span>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                          {course.name}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {course.credits} credits
                        </span>
                        {course.institution && (
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {course.institution}
                          </span>
                        )}
                        {course.prerequisites && (
                          <span style={{ fontSize: '0.875rem', color: '#d97706' }}>
                            Prerequisites: {course.prerequisites}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          // Pre-fill the completion form with this course
                          setShowAddCompletion(true);
                        }}
                        style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completions Tab */}
      {activeTab === 'completions' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
              Course Completions
            </h3>
            
            {completions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  No Completions Yet
                </h4>
                <p>Record your completed courses with grades and semesters.</p>
                <button 
                  onClick={() => setShowAddCompletion(true)}
                  style={{
                    marginTop: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle size={16} />
                  Record First Completion
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {completions.map(completion => (
                  <div key={completion.id} style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}>
                            {completion.code}
                          </span>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                            {completion.course_name}
                          </h4>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {completion.program_name && (
                            <span style={{ fontSize: '0.875rem', color: '#7c3aed' }}>
                              {completion.program_name}
                            </span>
                          )}
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {completion.semester} {completion.year}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {completion.credits} credits
                          </span>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            backgroundColor: getStatusColor(completion.status) + '20',
                            color: getStatusColor(completion.status),
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>
                            {completion.status}
                          </span>
                        </div>
                      </div>
                      {completion.grade && (
                        <div style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: getGradeColor(completion.grade) + '20',
                          color: getGradeColor(completion.grade),
                          borderRadius: '0.375rem',
                          fontSize: '1.125rem',
                          fontWeight: '700'
                        }}>
                          {completion.grade}
                        </div>
                      )}
                    </div>
                    {completion.notes && (
                      <div style={{ 
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '0.375rem',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.875rem',
                        color: '#64748b'
                      }}>
                        {completion.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab === 'programs' && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <BookMarked size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
          <h3>Detailed Programs Management</h3>
          <p>Advanced program management interface coming soon...</p>
          <p>For now, use the Overview tab to see your programs.</p>
        </div>
      )}

      {/* Modal Forms */}
      <AddProgramForm 
        isOpen={showAddProgram}
        onClose={() => setShowAddProgram(false)}
        onSubmit={handleAddProgram}
      />
      
      <AddCompletionForm 
        isOpen={showAddCompletion}
        onClose={() => setShowAddCompletion(false)}
        onSubmit={handleAddCompletion}
        programs={programs}
        courses={courses}
      />

      <QuickAddCourseForm 
        isOpen={showAddCourse}
        onClose={() => setShowAddCourse(false)}
        onSubmit={handleAddCourse}
      />

      {/* Program Management Modal */}
      {selectedProgramForManagement && (
        <ProgramManagementModal
          program={selectedProgramForManagement}
          isOpen={showManageProgram}
          onClose={handleCloseManageProgram}
          onUpdate={fetchData}
          courses={courses}
        />
      )}
    </div>
  );
};

export default Education;