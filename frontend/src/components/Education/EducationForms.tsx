import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Calendar, Book, Award, GraduationCap } from 'lucide-react';

// TypeScript interfaces
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

interface InputProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  required?: boolean;
}

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface Program {
  id: number;
  name: string;
  type: string;
}

interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
}

interface AddProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

interface AddCompletionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  programs?: Program[];
  courses?: Course[];
}

interface QuickAddCourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

// Modal wrapper component
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
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
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem'
            }}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Form input component
const FormField = ({ label, children, required = false }: FormFieldProps) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ 
      display: 'block', 
      fontSize: '0.875rem', 
      fontWeight: '500', 
      color: '#374151',
      marginBottom: '0.5rem'
    }}>
      {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
    </label>
    {children}
  </div>
);

// Input component
const Input = ({ type = 'text', value, onChange, placeholder, required = false, ...props }: InputProps & Record<string, any>) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    required={required}
    style={{
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: 'white',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box'
    }}
    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
    {...props}
  />
);

// Select component
const Select = ({ value, onChange, children, required = false, ...props }: SelectProps & Record<string, any>) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    required={required}
    style={{
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: 'white',
      outline: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box'
    }}
    {...props}
  >
    {children}
  </select>
);

// Textarea component
const Textarea = ({ value, onChange, placeholder, rows = 3, ...props }: TextareaProps & Record<string, any>) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: 'white',
      outline: 'none',
      resize: 'vertical',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    }}
    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
    {...props}
  />
);

// Add Educational Program Form
export const AddProgramForm = ({ isOpen, onClose, onSubmit }: AddProgramFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'bachelor',
    institution: '',
    status: 'planned',
    total_credits: '',
    start_date: '',
    target_completion_date: '',
    notes: ''
  });

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      alert('Program name is required');
      return;
    }
    
    const submitData = {
      ...formData,
      total_credits: formData.total_credits ? parseInt(formData.total_credits) : null,
      start_date: formData.start_date || null,
      target_completion_date: formData.target_completion_date || null,
      notes: formData.notes || null
    };

    try {
      await onSubmit(submitData);
      setFormData({
        name: '',
        type: 'bachelor',
        institution: '',
        status: 'planned',
        total_credits: '',
        start_date: '',
        target_completion_date: '',
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Educational Program">
      <div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <FormField label="Program Name" required>
            <Input
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Program Type" required>
              <Select
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <option value="certification">Certification</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="doctorate">Doctorate</option>
              </Select>
            </FormField>

            <FormField label="Status">
              <Select
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Institution">
            <Input
              value={formData.institution}
              onChange={(value) => setFormData(prev => ({ ...prev, institution: value }))}
              placeholder="e.g., University of California, Berkeley"
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <FormField label="Total Credits">
              <Input
                type="number"
                value={formData.total_credits}
                onChange={(value) => setFormData(prev => ({ ...prev, total_credits: value }))}
                placeholder="120"
                min="0"
              />
            </FormField>

            <FormField label="Start Date">
              <Input
                type="date"
                value={formData.start_date}
                onChange={(value) => setFormData(prev => ({ ...prev, start_date: value }))}
              />
            </FormField>

            <FormField label="Target Completion">
              <Input
                type="date"
                value={formData.target_completion_date}
                onChange={(value) => setFormData(prev => ({ ...prev, target_completion_date: value }))}
              />
            </FormField>
          </div>

          <FormField label="Notes">
            <Textarea
              value={formData.notes}
              onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
              placeholder="Any additional notes about this program..."
              rows={3}
            />
          </FormField>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
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
            type="button"
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
            <Save size={16} />
            Create Program
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Add Course Completion Form
export const AddCompletionForm = ({ isOpen, onClose, onSubmit, programs = [], courses = [] }: AddCompletionFormProps) => {
  const [formData, setFormData] = useState({
    course_id: '',
    program_id: '',
    semester: '',
    year: new Date().getFullYear().toString(),
    grade: '',
    grade_points: '',
    status: 'completed',
    completion_date: '',
    notes: ''
  });

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.course_id) {
      alert('Please select a course');
      return;
    }
    
    const submitData = {
      ...formData,
      course_id: parseInt(formData.course_id),
      program_id: formData.program_id ? parseInt(formData.program_id) : null,
      year: parseInt(formData.year),
      grade_points: formData.grade_points ? parseFloat(formData.grade_points) : null,
      completion_date: formData.completion_date || null,
      notes: formData.notes || null
    };

    try {
      await onSubmit(submitData);
      setFormData({
        course_id: '',
        program_id: '',
        semester: '',
        year: new Date().getFullYear().toString(),
        grade: '',
        grade_points: '',
        status: 'completed',
        completion_date: '',
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating completion:', error);
      alert('Failed to record completion. Please try again.');
    }
  };

  // Auto-fill grade points based on letter grade
  const handleGradeChange = (grade: string) => {
    setFormData(prev => ({ ...prev, grade }));
    
    const gradePoints: Record<string, string> = {
      'A+': '4.0', 'A': '4.0', 'A-': '3.7',
      'B+': '3.3', 'B': '3.0', 'B-': '2.7',
      'C+': '2.3', 'C': '2.0', 'C-': '1.7',
      'D+': '1.3', 'D': '1.0', 'D-': '0.7',
      'F': '0.0'
    };
    
    if (gradePoints[grade]) {
      setFormData(prev => ({ ...prev, grade_points: gradePoints[grade] }));
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - 10 + i);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Course Completion">
      <div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <FormField label="Course" required>
            <Select
              value={formData.course_id}
              onChange={(value) => setFormData(prev => ({ ...prev, course_id: value }))}
            >
              <option value="">Select a course...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name} ({course.credits} credits)
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Program (Optional)">
            <Select
              value={formData.program_id}
              onChange={(value) => setFormData(prev => ({ ...prev, program_id: value }))}
            >
              <option value="">Not part of a specific program</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </Select>
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <FormField label="Semester">
              <Select
                value={formData.semester}
                onChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
              >
                <option value="">Select semester...</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
              </Select>
            </FormField>

            <FormField label="Year">
              <Select
                value={formData.year}
                onChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Status">
              <Select
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <option value="completed">Completed</option>
                <option value="enrolled">Currently Enrolled</option>
                <option value="dropped">Dropped</option>
                <option value="withdrawn">Withdrawn</option>
              </Select>
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <FormField label="Grade">
              <Select
                value={formData.grade}
                onChange={handleGradeChange}
              >
                <option value="">Select grade...</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="D-">D-</option>
                <option value="F">F</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Audit">Audit</option>
              </Select>
            </FormField>

            <FormField label="Grade Points">
              <Input
                type="number"
                value={formData.grade_points}
                onChange={(value) => setFormData(prev => ({ ...prev, grade_points: value }))}
                placeholder="4.0"
                min="0"
                max="4"
                step="0.1"
              />
            </FormField>

            <FormField label="Completion Date">
              <Input
                type="date"
                value={formData.completion_date}
                onChange={(value) => setFormData(prev => ({ ...prev, completion_date: value }))}
              />
            </FormField>
          </div>

          <FormField label="Notes">
            <Textarea
              value={formData.notes}
              onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
              placeholder="Any additional notes about this course completion..."
              rows={3}
            />
          </FormField>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
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
            type="button"
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
            <Save size={16} />
            Record Completion
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Quick Add Course Form (simpler version)
export const QuickAddCourseForm = ({ isOpen, onClose, onSubmit }: QuickAddCourseFormProps) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '3',
    institution: ''
  });

  const handleSubmit = async () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Course code and name are required');
      return;
    }
    
    const submitData = {
      ...formData,
      credits: parseInt(formData.credits),
      institution: formData.institution || null
    };

    try {
      await onSubmit(submitData);
      setFormData({
        code: '',
        name: '',
        credits: '3',
        institution: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Add Course">
      <div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem' }}>
            <FormField label="Course Code" required>
              <Input
                value={formData.code}
                onChange={(value) => setFormData(prev => ({ ...prev, code: value.toUpperCase() }))}
                placeholder="CS101"
              />
            </FormField>

            <FormField label="Course Name" required>
              <Input
                value={formData.name}
                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                placeholder="Introduction to Programming"
              />
            </FormField>

            <FormField label="Credits">
              <Select
                value={formData.credits}
                onChange={(value) => setFormData(prev => ({ ...prev, credits: value }))}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Institution">
            <Input
              value={formData.institution}
              onChange={(value) => setFormData(prev => ({ ...prev, institution: value }))}
              placeholder="e.g., Community College"
            />
          </FormField>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
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
            type="button"
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
    </Modal>
  );
};

export default { AddProgramForm, AddCompletionForm, QuickAddCourseForm };