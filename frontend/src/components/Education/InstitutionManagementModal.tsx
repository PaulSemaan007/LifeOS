import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Edit,
  Trash2,
  Save,
  X,
  ExternalLink
} from 'lucide-react';

// TypeScript interfaces
interface Institution {
  id: number;
  name: string;
  type?: string;
  website?: string;
  notes?: string;
  created_at: string;
}

// Institution API
const institutionAPI = {
  getAll: () => fetch('http://localhost:5000/api/education/institutions').then(r => r.json()),
  create: (data: any) => fetch('http://localhost:5000/api/education/institutions', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  update: (id: number, data: any) => fetch(`http://localhost:5000/api/education/institutions/${id}`, { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),
  delete: (id: number) => fetch(`http://localhost:5000/api/education/institutions/${id}`, { 
    method: 'DELETE' 
  }).then(r => r.json()),
};

// Add Institution Form
const AddInstitutionForm = ({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'university',
    website: '',
    notes: ''
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Institution name is required');
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        type: formData.type || null,
        website: formData.website.trim() || null,
        notes: formData.notes.trim() || null
      };

      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        name: '',
        type: 'university',
        website: '',
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating institution:', error);
      alert('Failed to create institution. Please try again.');
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
        maxWidth: '500px',
        width: '90vw',
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
            Add Institution
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Institution Name *
            </label>
            <input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Santiago Canyon College"
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
              Institution Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="university">University</option>
              <option value="community_college">Community College</option>
              <option value="certification_body">Certification Body</option>
              <option value="online">Online Platform</option>
              <option value="trade_school">Trade School</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://www.example.edu"
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
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about this institution..."
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
            Add Institution
          </button>
        </div>
      </div>
    </div>
  );
};

// Institution Management Modal
const InstitutionManagementModal = ({ isOpen, onClose, onUpdate }: {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', type: '', website: '', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInstitutions();
    }
  }, [isOpen]);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const response = await institutionAPI.getAll();
      setInstitutions(response.data || []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitution = async (data: any) => {
    try {
      await institutionAPI.create(data);
      fetchInstitutions();
      onUpdate();
    } catch (error) {
      console.error('Error adding institution:', error);
      throw error;
    }
  };

  const handleEditStart = (institution: Institution) => {
    setEditingId(institution.id);
    setEditData({
      name: institution.name,
      type: institution.type || '',
      website: institution.website || '',
      notes: institution.notes || ''
    });
  };

  const handleEditSave = async (id: number) => {
    try {
      await institutionAPI.update(id, editData);
      setEditingId(null);
      fetchInstitutions();
      onUpdate();
    } catch (error) {
      console.error('Error updating institution:', error);
      alert('Failed to update institution');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await institutionAPI.delete(id);
        fetchInstitutions();
        onUpdate();
      } catch (error) {
        console.error('Error deleting institution:', error);
        alert('Failed to delete institution');
      }
    }
  };

  const getTypeDisplay = (type?: string) => {
    const typeMap: Record<string, string> = {
      'university': 'University',
      'community_college': 'Community College',
      'certification_body': 'Certification Body',
      'online': 'Online Platform',
      'trade_school': 'Trade School',
      'other': 'Other'
    };
    return typeMap[type || ''] || type || 'Not specified';
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
            Manage Institutions
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowAddForm(true)}
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
              Add Institution
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            Loading institutions...
          </div>
        ) : institutions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <Building size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
            <h4>No Institutions Yet</h4>
            <p>Add institutions to create dropdown menus for programs and courses.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {institutions.map((institution) => (
              <div key={institution.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                {editingId === institution.id ? (
                  <div style={{ flex: 1, display: 'grid', gap: '0.5rem' }}>
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <select
                        value={editData.type}
                        onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="university">University</option>
                        <option value="community_college">Community College</option>
                        <option value="certification_body">Certification Body</option>
                        <option value="online">Online Platform</option>
                        <option value="trade_school">Trade School</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="url"
                        value={editData.website}
                        onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="Website URL"
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          backgroundColor: 'white',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEditSave(institution.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Save size={12} />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                        {institution.name}
                      </h4>
                      {institution.website && (
                        <a
                          href={institution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: '#3b82f6',
                            fontSize: '0.75rem',
                            textDecoration: 'none'
                          }}
                        >
                          <ExternalLink size={12} />
                          Visit
                        </a>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {getTypeDisplay(institution.type)}
                    </div>
                    {institution.notes && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {institution.notes}
                      </div>
                    )}
                  </div>
                )}

                {editingId !== institution.id && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditStart(institution)}
                      style={{
                        padding: '0.25rem',
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(institution.id, institution.name)}
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
                )}
              </div>
            ))}
          </div>
        )}

        <AddInstitutionForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddInstitution}
        />
      </div>
    </div>
  );
};

export default InstitutionManagementModal;