'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AddStudentForm({ studentToEdit, onStudentAdded, onStudentUpdated, onCancel }) {
  // --- All of your existing logic is unchanged ---
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [section, setSection] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();
  const isEditMode = !!studentToEdit;

  useEffect(() => {
    if (isEditMode) {
      setName(studentToEdit.name);
      setRollNumber(studentToEdit.rollNumber);
      setSection(studentToEdit.section);
      setDepartment(studentToEdit.department);
    } else {
      setName(''); setRollNumber(''); setSection(''); setDepartment('');
    }
    setError(''); setSuccess('');
  }, [studentToEdit, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!token) { setError("Authentication error. Please log in again."); return; }

    const studentData = { name, rollNumber, section, department };
    const url = isEditMode
      ? `http://localhost:5000/api/students/${studentToEdit._id}`
      : `http://localhost:5000/api/students`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, body: JSON.stringify(studentData) });
      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.msg || `Failed to ${isEditMode ? 'update' : 'add'} student`); }
      const resultData = await res.json();
      if (isEditMode) { onStudentUpdated(resultData); setSuccess(`Student "${name}" updated successfully!`); } 
      else { onStudentAdded(resultData); setSuccess(`Student "${name}" added successfully!`); }
    } catch (err) { setError(err.message); }
  };
  // --- End of unchanged logic ---


  // --- NEW: STYLES (with Glassmorphism and animations) ---
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10); // Trigger animation on mount
    return () => clearTimeout(timer);
  }, []);

  const formStyle = { 
    padding: '30px', 
    borderRadius: '12px', 
    marginBottom: '2rem',
    // Glassmorphism
    backgroundColor: 'rgba(22, 22, 37, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(74, 74, 90, 0.5)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    // Animation
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
  };

  const inputGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '0.9rem' };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0', fontSize: '1rem', transition: 'box-shadow 0.3s, border-color 0.3s' };
  const buttonStyle = (isPrimary) => ({ flex: 1, padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: isPrimary ? '#00c6ff' : '#4a4a5a', color: isPrimary ? '#161625' : '#e0e0e0', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s ease, background-color 0.3s' });
  const buttonContainerStyle = { display: 'flex', gap: '10px', marginTop: '20px' };
  const messageStyle = { textAlign: 'center', marginBottom: '10px', padding: '10px', borderRadius: '5px' };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
        <h3 style={{ marginTop: 0, textAlign: 'center', marginBottom: '25px' }}>{isEditMode ? 'Edit Student Details' : 'Add a New Student'}</h3>
        {error && <p style={{...messageStyle, color: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)'}}>{error}</p>}
        {success && <p style={{...messageStyle, color: 'lightgreen', backgroundColor: 'rgba(0, 255, 0, 0.1)'}}>{success}</p>}
        
        <div style={inputGroupStyle}> <label style={labelStyle}>Full Name</label> <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={e => e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.5)'} onBlur={e => e.target.style.boxShadow = 'none'} required /> </div>
        <div style={inputGroupStyle}> <label style={labelStyle}>Roll Number</label> <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} style={inputStyle} onFocus={e => e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.5)'} onBlur={e => e.target.style.boxShadow = 'none'} required /> </div>
        <div style={inputGroupStyle}> <label style={labelStyle}>Section</label> <input type="text" value={section} onChange={(e) => setSection(e.target.value)} style={inputStyle} onFocus={e => e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.5)'} onBlur={e => e.target.style.boxShadow = 'none'} required /> </div>
        <div style={inputGroupStyle}> <label style={labelStyle}>Department</label> <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle} onFocus={e => e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.5)'} onBlur={e => e.target.style.boxShadow = 'none'} required /> </div>
        
        <div style={buttonContainerStyle}>
          <button type="button" onClick={onCancel} style={buttonStyle(false)} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>Cancel</button>
          <button type="submit" style={buttonStyle(true)} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>{isEditMode ? 'Update Student' : 'Add Student'}</button>
        </div>
    </form>
  );
};