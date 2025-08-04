import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit,
  Settings,
  Trash2,
  Save,
  X
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

interface ProgramRequirement {
  id: number;
  program_id: number;
  course_id: number;
  code: string;
  course_name: string;
  credits: number;
  requirement_type: string;
  category: string;
}

// Enhanced API service
const educationAPI = {
  updateProgram: (id: number, data: any) => fetch(`http://localhost:5000/api/education/programs/${id}`, { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  
  createCourse: (data: any) => fetch('http://localhost:5000/api/education/courses', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  
  getProgramRequirements: (programId: number) => fetch(`http://localhost:5000/api/education/programs/${programId}/requirements`).then(r => r.json()),
  addProgramRequirement: (programId: number, data: any) => fetch(`http://localhost:5000/api/education/programs/${programId}/requirements`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  removeProgramRequirement: (programId: number, requirementId: number) => fetch(`http://localhost:5000/api/education/programs/${programId}/requirements/${requirementId}`, { 
    method: 'DELETE' 
  }).then(r => r.json()),
  
  addPrerequisite: (courseId: number, prerequisiteId: number) => fetch(`http://localhost:5000/api/education/courses/${courseId}/prerequisites`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ prerequisite_course_id: prerequisiteId }) 
  }).then(r => r.json()),
};

// Enhanced Course Form with Prerequisites
const EnhancedCourseForm = ({ isOpen, onClose, onSubmit, existingCourses = [], programId = null, onCourseAdded }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  existingCourses: Course[];
  programId?: number | null;
  onCourseAdded: () => void;
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '3',
    institution: '',
    description: '',
    hasPrerequisite: false,
    prerequisiteId: '',
    addToProgram: !!programId,
    category: 'Core'
  });

  const handleSubmit = async () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Course code and name are required');
      return;
    }

    try {
      // First create the course
      const courseData = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        credits: parseInt(formData.credits),
        institution: formData.institution || null,
        description: formData.description || null
      };

      const courseResult = await educationAPI.createCourse(courseData);
      const newCourseId = courseResult.id;

      // Add prerequisite if specified
      if (formData.hasPrerequisite && formData.prerequisiteId) {
        await educationAPI.addPrerequisite(newCourseId, parseInt(formData.prerequisiteId));
      }

      // Add to program requirements if specified
      if (formData.addToProgram && programId) {
        await educationAPI.addProgramRequirement(programId, {
          course_id: newCourseId,
          requirement_type: 'required',
          category: formData.category
        });
      }

      await onSubmit(courseData);
      onCourseAdded(); // Refresh the parent data
      
      // Reset form
      setFormData({
        code: '',
        name: '',
        credits: '3',
        institution: '',
        description: '',
        hasPrerequisite: false,
        prerequisiteId: '',
        addToProgram: !!programId,
        category: 'Core'
      });
      onClose();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        maxWidth: '600px',
        width: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
            Add Course {programId ? 'to Program' : ''}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Course Code *
              </label>
              <input
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="CS101"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Credits
              </label>
              <select
                value={formData.credits}
                onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            {programId && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Core">Core</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="General Ed">General Education</option>
                  <option value="Elective">Elective</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Course Name *
            </label>
            <input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Introduction to Programming"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Institution
            </label>
            <input
              value={formData.institution}
              onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
              placeholder="e.g., Community College"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Prerequisites Section */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.hasPrerequisite}
                onChange={(e) => setFormData(prev => ({ ...prev, hasPrerequisite: e.target.checked, prerequisiteId: '' }))}
                style={{ margin: 0 }}
              />
              This course has a prerequisite
            </label>
            
            {formData.hasPrerequisite && (
              <select
                value={formData.prerequisiteId}
                onChange={(e) => setFormData(prev => ({ ...prev, prerequisiteId: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select prerequisite course...</option>
                {existingCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Course description, topics covered, etc..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            Add Course
          </button>
        </div>
      </div>
    </div>
  );
};

// Program Management Modal
const ProgramManagementModal = ({ program, isOpen, onClose, onUpdate, courses }: {
  program: Program;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  courses: Course[];
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'requirements'>('details');
  const [requirements, setRequirements] = useState<ProgramRequirement[]>([]);
  const [editingProgram, setEditingProgram] = useState(false);
  const [programData, setProgramData] = useState({
    name: program.name,
    type: program.type,
    institution: program.institution,
    status: program.status,
    total_credits: program.total_credits?.toString() || '',
    start_date: program.start_date || '',
    target_completion_date: program.target_completion_date || '',
    notes: program.notes || ''
  });
  const [showAddCourse, setShowAddCourse] = useState(false);

  useEffect(() => {
    if (isOpen && program.id) {
      fetchRequirements();
      // Reset program data when program changes
      setProgramData({
        name: program.name,
        type: program.type,
        institution: program.institution,
        status: program.status,
        total_credits: program.total_credits?.toString() || '',
        start_date: program.start_date || '',
        target_completion_date: program.target_completion_date || '',
        notes: program.notes || ''
      });
    }
  }, [isOpen, program]);

  const fetchRequirements = async () => {
    try {
      const response = await educationAPI.getProgramRequirements(program.id);
      setRequirements(response.data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

  const handleUpdateProgram = async () => {
    try {
      const updateData = {
        ...programData,
        total_credits: programData.total_credits ? parseInt(programData.total_credits) : null,
        start_date: programData.start_date || null,
        target_completion_date: programData.target_completion_date || null,
        notes: programData.notes || null
      };

      await educationAPI.updateProgram(program.id, updateData);
      setEditingProgram(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Failed to update program');
    }
  };

  const handleRemoveRequirement = async (requirementId: number) => {
    try {
      await educationAPI.removeProgramRequirement(program.id, requirementId);
      fetchRequirements();
      onUpdate();
    } catch (error) {
      console.error('Error removing requirement:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        maxWidth: '900px',
        width: '95vw',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
            Manage Program: {program.name}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '0.75rem 1rem',
              background: activeTab === 'details' ? '#3b82f6' : 'transparent',
              color: activeTab === 'details' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem 0.375rem 0 0',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Program Details
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            style={{
              padding: '0.75rem 1rem',
              background: activeTab === 'requirements' ? '#3b82f6' : 'transparent',
              color: activeTab === 'requirements' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem 0.375rem 0 0',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Required Courses ({requirements.length})
          </button>
        </div>

        {/* Program Details Tab */}
        {activeTab === 'details' && (
          <div>
            {!editingProgram ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>Program Information</h3>
                  <button
                    onClick={() => setEditingProgram(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit size={16} />
                    Edit Program
                  </button>
                </div>
                
                <div style={{ display: 'grid', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <strong>Program Type:</strong> {program.type}
                    </div>
                    <div>
                      <strong>Status:</strong> {program.status}
                    </div>
                  </div>
                  <div>
                    <strong>Institution:</strong> {program.institution || 'Not specified'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <strong>Total Credits:</strong> {program.total_credits || 'Not specified'}
                    </div>
                    <div>
                      <strong>Credits Earned:</strong> {program.credits_earned || 0}
                    </div>
                  </div>
                  {program.notes && (
                    <div>
                      <strong>Notes:</strong> {program.notes}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>Edit Program</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setEditingProgram(false)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProgram}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Program Name
                    </label>
                    <input
                      value={programData.name}
                      onChange={(e) => setProgramData(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Program Type
                      </label>
                      <select
                        value={programData.type}
                        onChange={(e) => setProgramData(prev => ({ ...prev, type: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="certification">Certification</option>
                        <option value="associate">Associate Degree</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="doctorate">Doctorate</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Status
                      </label>
                      <select
                        value={programData.status}
                        onChange={(e) => setProgramData(prev => ({ ...prev, status: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="planned">Planned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Institution
                    </label>
                    <input
                      value={programData.institution}
                      onChange={(e) => setProgramData(prev => ({ ...prev, institution: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Total Credits
                    </label>
                    <input
                      type="number"
                      value={programData.total_credits}
                      onChange={(e) => setProgramData(prev => ({ ...prev, total_credits: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>Required Courses</h3>
              <button
                onClick={() => setShowAddCourse(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                Add Course
              </button>
            </div>

            {requirements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <BookOpen size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                <h4>No Required Courses Yet</h4>
                <p>Add courses that are required for this program.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {requirements.map((req) => (
                  <div key={req.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {req.code}
                        </span>
                        <span style={{ fontWeight: '500' }}>{req.course_name}</span>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {req.credits} credits
                        </span>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }}>
                          {req.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveRequirement(req.id)}
                      style={{
                        padding: '0.25rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Course Form */}
        <EnhancedCourseForm
          isOpen={showAddCourse}
          onClose={() => setShowAddCourse(false)}
          onSubmit={async () => {
            // This will be called but we mainly want onCourseAdded
          }}
          onCourseAdded={() => {
            fetchRequirements();
            onUpdate();
          }}
          existingCourses={courses}
          programId={program.id}
        />
      </div>
    </div>
  );
};

export default ProgramManagementModal;