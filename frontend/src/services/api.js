import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced Education API
export const educationAPI = {
  // Original simple education endpoints (for backward compatibility)
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),

  // Educational Programs endpoints
  getPrograms: () => api.get('/education/programs'),
  getProgram: (id) => api.get(`/education/programs/${id}`),
  createProgram: (data) => api.post('/education/programs', data),
  updateProgram: (id, data) => api.put(`/education/programs/${id}`, data),
  deleteProgram: (id) => api.delete(`/education/programs/${id}`),

  // Courses endpoints
  getCourses: () => api.get('/education/courses'),
  getCourse: (id) => api.get(`/education/courses/${id}`),
  createCourse: (data) => api.post('/education/courses', data),
  updateCourse: (id, data) => api.put(`/education/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/education/courses/${id}`),

  // Course Prerequisites endpoints
  getCoursePrerequisites: (courseId) => api.get(`/education/courses/${courseId}/prerequisites`),
  addPrerequisite: (courseId, data) => api.post(`/education/courses/${courseId}/prerequisites`, data),
  removePrerequisite: (courseId, prerequisiteId) => api.delete(`/education/courses/${courseId}/prerequisites/${prerequisiteId}`),

  // Course Completions endpoints
  getCompletions: () => api.get('/education/completions'),
  getProgramCompletions: (programId) => api.get(`/education/programs/${programId}/completions`),
  createCompletion: (data) => api.post('/education/completions', data),
  updateCompletion: (id, data) => api.put(`/education/completions/${id}`, data),
  deleteCompletion: (id) => api.delete(`/education/completions/${id}`),

  // Transfer Credits endpoints
  getProgramTransfers: (programId) => api.get(`/education/programs/${programId}/transfers`),
  createTransfer: (data) => api.post('/education/transfers', data),
  updateTransfer: (id, data) => api.put(`/education/transfers/${id}`, data),
  deleteTransfer: (id) => api.delete(`/education/transfers/${id}`),

  // Statistics and Analytics
  getStats: () => api.get('/education/stats'),
  getProgramProgress: (programId) => api.get(`/education/programs/${programId}/progress`),
};

// Finances API (keeping existing)
export const financesAPI = {
  getAll: () => api.get('/finances'),
  getSummary: () => api.get('/finances/summary'),
  create: (data) => api.post('/finances', data),
  update: (id, data) => api.put(`/finances/${id}`, data),
  delete: (id) => api.delete(`/finances/${id}`),
};

// Fitness API (keeping existing)
export const fitnessAPI = {
  getAll: () => api.get('/fitness'),
  getStats: () => api.get('/fitness/stats'),
  create: (data) => api.post('/fitness', data),
  update: (id, data) => api.put(`/fitness/${id}`, data),
  delete: (id) => api.delete(`/fitness/${id}`),
};

// Career API (keeping existing)
export const careerAPI = {
  getAll: () => api.get('/career'),
  getByStatus: (status) => api.get(`/career/status/${status}`),
  create: (data) => api.post('/career', data),
  update: (id, data) => api.put(`/career/${id}`, data),
  delete: (id) => api.delete(`/career/${id}`),
};

// Helper functions for education data
export const educationHelpers = {
  // Calculate GPA from completions
  calculateGPA: (completions) => {
    const gradePoints = completions
      .filter(c => c.grade_points !== null && c.grade_points !== undefined)
      .map(c => ({ points: c.grade_points, credits: c.credits || 3 }));
    
    if (gradePoints.length === 0) return null;
    
    const totalPoints = gradePoints.reduce((sum, g) => sum + (g.points * g.credits), 0);
    const totalCredits = gradePoints.reduce((sum, g) => sum + g.credits, 0);
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;
  },

  // Check if prerequisites are met
  checkPrerequisites: (courseId, completedCourses, prerequisites) => {
    const coursePrereqs = prerequisites.filter(p => p.course_id === courseId);
    if (coursePrereqs.length === 0) return true;
    
    return coursePrereqs.every(prereq => 
      completedCourses.some(completed => 
        completed.course_id === prereq.prerequisite_course_id && 
        completed.status === 'completed'
      )
    );
  },

  // Get courses eligible for enrollment
  getEligibleCourses: (allCourses, completedCourses, prerequisites) => {
    return allCourses.filter(course => {
      const alreadyCompleted = completedCourses.some(c => 
        c.course_id === course.id && c.status === 'completed'
      );
      
      if (alreadyCompleted) return false;
      
      return educationHelpers.checkPrerequisites(course.id, completedCourses, prerequisites);
    });
  },

  // Calculate program completion percentage
  calculateProgramProgress: (program, completions, requirements) => {
    const requiredCourses = requirements.filter(r => r.program_id === program.id);
    if (requiredCourses.length === 0) return 0;
    
    const completedRequired = requiredCourses.filter(req => 
      completions.some(comp => 
        comp.course_id === req.course_id && 
        comp.program_id === program.id && 
        comp.status === 'completed'
      )
    );
    
    return Math.round((completedRequired.length / requiredCourses.length) * 100);
  },

  // Get semester options for dropdowns
  getSemesterOptions: () => {
    const currentYear = new Date().getFullYear();
    const semesters = [];
    
    for (let year = currentYear - 10; year <= currentYear + 5; year++) {
      semesters.push(
        { value: `Spring ${year}`, label: `Spring ${year}` },
        { value: `Summer ${year}`, label: `Summer ${year}` },
        { value: `Fall ${year}`, label: `Fall ${year}` },
        { value: `Winter ${year}`, label: `Winter ${year}` }
      );
    }
    
    return semesters.reverse(); // Most recent first
  },

  // Grade to GPA conversion
  gradeToGPA: (grade) => {
    const gradeMap = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0, 'Pass': null, 'Fail': 0.0
    };
    return gradeMap[grade] !== undefined ? gradeMap[grade] : null;
  },

  // Format program type for display
  formatProgramType: (type) => {
    const typeMap = {
      'certification': 'Certification',
      'associate': 'Associate Degree',
      'bachelor': 'Bachelor\'s Degree',
      'master': 'Master\'s Degree',
      'doctorate': 'Doctorate',
      'other': 'Other'
    };
    return typeMap[type] || type;
  }
};

export default api;