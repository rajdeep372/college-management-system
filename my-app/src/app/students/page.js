'use client';
import AddStudentForm from '../../components/AddStudentForm';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function StudentsPage() {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { token } = useAuth();
  
  // State for interactivity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/students`);
        if (!res.ok) throw new Error('Could not fetch students');
        const data = await res.json();
        setAllStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Apply search filter when search term changes
  useEffect(() => {
    const result = allStudents.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(result);
  }, [searchTerm, allStudents]);

  // --- HANDLER FUNCTIONS ---
  const handleEditClick = (student) => {
    setStudentToEdit(student);
    setShowAddForm(true);
  };
  
  // The handleDeleteClick function is now REMOVED.

  const handleFormCancel = () => {
    setShowAddForm(false);
    setStudentToEdit(null);
  };
  
  const handleStudentAdded = (newStudent) => {
    setAllStudents(prev => [newStudent, ...prev]);
    setShowAddForm(false);
  };

  const handleStudentUpdated = (updatedStudent) => {
    setAllStudents(prev => prev.map(s => s._id === updatedStudent._id ? updatedStudent : s));
    setShowAddForm(false);
    setStudentToEdit(null);
  };

  // --- STYLES ---
  const headerStyle = { fontSize: '2.5rem', color: '#e0e0e0', borderBottom: '2px solid #00c6ff', paddingBottom: '10px', marginBottom: '1rem' };
  const controlsContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' };
  const searchInputStyle = { width: '300px', padding: '10px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0' };
  const addButtonStyle = { padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#00c6ff', color: '#161625', fontWeight: 'bold', cursor: 'pointer' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
  const thStyle = { backgroundColor: '#00c6ff', color: '#161625', padding: '12px 15px', textAlign: 'left' };
  const trHoverStyle = { backgroundColor: '#1a1a2e' };
  const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #4a4a5a', transition: 'background-color 0.3s' };
  // A single style for the Edit button is now sufficient
  const actionButtonStyle = { padding: '5px 10px', marginRight: '5px', border: 'none', borderRadius: '5px', color: 'white', backgroundColor: '#3182ce', cursor: 'pointer' };
  const messageStyle = { textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' };

  if (loading) return <p style={messageStyle}>Loading students...</p>;
  if (error) return <p style={{ ...messageStyle, color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1 style={headerStyle}>Manage Students</h1>
      
      <div style={controlsContainerStyle}>
        <input 
          type="text"
          placeholder="Search by name or roll number..."
          style={searchInputStyle}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {!showAddForm && token && (
          <button onClick={() => { setShowAddForm(true); setStudentToEdit(null); }} style={addButtonStyle}>
            + Add New Student
          </button>
        )}
      </div>

      {showAddForm && token && (
        <AddStudentForm 
          studentToEdit={studentToEdit}
          onStudentAdded={handleStudentAdded}
          onStudentUpdated={handleStudentUpdated}
          onCancel={handleFormCancel}
        />
      )}
      
      <h2>Existing Students</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Roll Number</th>
            <th style={thStyle}>Section</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Attendance Points</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <tr 
                key={student._id}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = trHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                <td style={tdStyle}>{student.name}</td>
                <td style={tdStyle}>{student.rollNumber}</td>
                <td style={tdStyle}>{student.section}</td>
                <td style={tdStyle}>{student.department}</td>
                <td style={tdStyle}>{student.attendancePoints}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEditClick(student)} style={actionButtonStyle}>Edit</button>
                  {/* The Delete button is now REMOVED from the JSX */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{...tdStyle, textAlign: 'center'}}>No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}