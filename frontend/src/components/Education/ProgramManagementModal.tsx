import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  Calendar, 
  Book, 
  Award, 
  GraduationCap,
  Settings,
  BookOpen,
  CheckCircle,
  Edit
} from 'lucide-react';

// TypeScript interfaces
interface Institution {
  id: number;
  name: string;
  type?: string;
  website?: string;
  notes?: string;
}

interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
}

interface Program {
  id: number;
  name: string;
  type: string;
  institution?: string;
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
        maxWidth: '800px',
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

// Form input components
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

// Program Management Modal
const ProgramManagementModal = ({ 
  program, 
  isOpen, 
  onClose, 
  onUpdate, 
  courses = [], 
  institutions = [] 
}: {
  program: Program;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  courses?: Course[];
  institutions?: Institution[];
}) => {
  const [activeSection, setActiveSection] = useState<'details' | 'requirements' | 'progress'>('details');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: program?.name || '',
    type: program?.type || 'bachelor',
    institution: program?.institution || '',
    status: program?.status || 'planned',
    total_credits: program?.total_credits?.toString() || '',
    start_date: program?.start_date || '',
    target_completion_date: program?.target_completion_date || '',
    completion_date: program?.completion_date || '',
    gpa: program?.gpa?.toString() || '',
    notes: program?.notes || ''
  });

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name || '',
        type: program.type || 'bachelor',
        institution: program.institution || '',
        status: program.status || 'planned',
        total_credits: program.total_credits?.toString() || '',
        start_date: program.start_date || '',
        target_completion_date: program.target_completion_date || '',
        completion_date: program.completion_date || '',
        gpa: program.gpa?.toString() || '',
        notes: program.notes || ''
      });
    }
  }, [program]);

  const handleSave = async () => {
    try {
      // In a full implementation, this would call the API to update the program
      console.log('Saving program data:', formData);
      
      // For now, just show a success message
      alert('Program updated successfully!');
      setEditMode(false);
      onUpdate(); // Refresh the data
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Failed to update program: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const calculateProgress = () => {
    if (!program.total_credits) return 0;
    return Math.round((program.credits_earned / program.total_credits) * 100);
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

  if (!program) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Program: ${program.name}`}>
      <div>
        {/* Section Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1rem'
        }}>
          {[
            { id: 'details' as const, label: 'Program Details', icon: Settings },
            { id: 'requirements' as const, label: 'Course Requirements', icon: BookOpen },
            { id: 'progress' as const, label: 'Progress & Analytics', icon: CheckCircle }
          ].map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: activeSection === section.id ? '#3b82f6' : 'transparent',
                  color: activeSection === section.id ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Icon size={16} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content based on active section */}
        {activeSection === 'details' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                Program Details
              </h3>
              <button
                onClick={() => editMode ? handleSave() : setEditMode(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: editMode ? '#16a34a' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                {editMode ? <Save size={16} /> : <Edit size={16} />}
                {editMode ? 'Save Changes' : 'Edit Program'}
              </button>
            </div>

            {editMode ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <FormField label="Program Name" required>
                  <Input
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                  />
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField label="Program Type">
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

                {formData.status === 'completed' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormField label="Completion Date">
                      <Input
                        type="date"
                        value={formData.completion_date}
                        onChange={(value) => setFormData(prev => ({ ...prev, completion_date: value }))}
                      />
                    </FormField>

                    <FormField label="Final GPA">
                      <Input
                        type="number"
                        value={formData.gpa}
                        onChange={(value) => setFormData(prev => ({ ...prev, gpa: value }))}
                        placeholder="3.50"
                        min="0"
                        max="4"
                        step="0.01"
                      />
                    </FormField>
                  </div>
                )}

                <FormField label="Notes">
                  <Textarea
                    value={formData.notes}
                    onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
                    placeholder="Any additional notes about this program..."
                    rows={3}
                  />
                </FormField>
              </div>
            ) : (
              // Display mode
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Program Type</div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{program.type}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Status</div>
                      <div style={{ 
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getStatusColor(program.status) + '20',
                        color: getStatusColor(program.status),
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {program.status}
                      </div>
                    </div>
                    {program.institution && (
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Institution</div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{program.institution}</div>
                      </div>
                    )}
                    {program.total_credits && (
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Credits</div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>
                          {program.credits_earned} / {program.total_credits} ({calculateProgress()}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {program.notes && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Notes</div>
                    <div style={{ color: '#374151' }}>{program.notes}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'requirements' && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <BookOpen size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
            <h3>Course Requirements Management</h3>
            <p>Add required courses, track completion, and manage prerequisites.</p>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Coming soon in the next update...</p>
          </div>
        )}

        {activeSection === 'progress' && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
            <h3>Progress & Analytics</h3>
            <p>View detailed progress reports, GPA calculations, and graduation timeline.</p>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Coming soon in the next update...</p>
          </div>
        )}

        {/* Footer buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'flex-end'
        }}>
          {editMode && (
            <button
              onClick={() => setEditMode(false)}
              style={{
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
          )}
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProgramManagementModal;