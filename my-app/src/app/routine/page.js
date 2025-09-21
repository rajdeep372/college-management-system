'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RoutinePage() {
  const [routines, setRoutines] = useState([]);
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('');
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [department, setDepartment] = useState(''); // Renamed state
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines`);
        if (!res.ok) throw new Error('Could not fetch routines');
        const data = await res.json();
        setRoutines(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!token) {
      setError("You must be logged in to add a routine.");
      return;
    }
    // Updated payload to send 'department'
    const newRoutineData = { day, time, subject, teacher, department, section };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newRoutineData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to add routine item");
      }
      const newRoutine = await res.json();
      setRoutines(prev => [newRoutine, ...prev]);
      setSuccess('Routine item added successfully!');
      // Clear form fields
      setTime('');
      setSubject('');
      setTeacher('');
      setDepartment(''); // Clear new state
      setSection('');
    } catch (err) {
      setError(err.message);
    }
  };

  // --- STYLES ---
  const headerStyle = { fontSize: '2.5rem', color: '#e0e0e0', borderBottom: '2px solid #00c6ff', paddingBottom: '10px', marginBottom: '2rem' };
  const formStyle = { backgroundColor: '#161625', padding: '25px', borderRadius: '8px', border: '1px solid #4a4a5a', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', marginBottom: '2rem' };
  const inputGroupStyle = { display: 'flex', flexDirection: 'column', flex: '1 1 200px' };
  const labelStyle = { marginBottom: '5px', color: '#a0a0a0' };
  const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0', fontSize: '1rem' };
  const buttonStyle = { padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#00c6ff', color: '#161625', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', height: '45px' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
  const thStyle = { backgroundColor: '#00c6ff', color: '#161625', padding: '12px 15px', textAlign: 'left' };
  const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #4a4a5a' };
  const messageStyle = { textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', padding: '10px', borderRadius: '5px' };

  if (loading) return <p style={messageStyle}>Loading routines...</p>;

  return (
    <div>
      <h1 style={headerStyle}>Manage Class Routine</h1>
      {token ? (
        <form onSubmit={handleSubmit} style={formStyle}>
            {/* Form Fields... */}
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Day</label>
                <select style={inputStyle} value={day} onChange={(e) => setDay(e.target.value)}>
                    <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                    <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                </select>
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Time</label>
                <input type="text" style={inputStyle} placeholder="e.g., 09:00 - 10:00" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Subject</label>
                <input type="text" style={inputStyle} placeholder="e.g., Physics" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Teacher</label>
                <input type="text" style={inputStyle} placeholder="e.g., Mr. Armstrong" value={teacher} onChange={(e) => setTeacher(e.target.value)} required />
            </div>
            {/* THIS IS THE UPDATED INPUT FIELD */}
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Department</label>
                <input type="text" style={inputStyle} placeholder="e.g., Science" value={department} onChange={(e) => setDepartment(e.target.value)} required />
            </div>
            <div style={inputGroupStyle}>
                <label style={labelStyle}>Section</label>
                <input type="text" style={inputStyle} placeholder="e.g., A" value={section} onChange={(e) => setSection(e.target.value)} required />
            </div>
            <button type="submit" style={buttonStyle}>Add to Routine</button>
        </form>
      ) : (
        <p style={{...messageStyle, backgroundColor: '#161625'}}>Please log in to add a routine.</p>
      )}
      {error && <p style={{...messageStyle, color: '#ff4d4d', backgroundColor: 'rgba(255, 0, 0, 0.1)'}}>{error}</p>}
      {success && <p style={{...messageStyle, color: '#7cfc00', backgroundColor: 'rgba(0, 255, 0, 0.1)'}}>{success}</p>}
      <h2>Existing Routines</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Day</th><th style={thStyle}>Time</th><th style={thStyle}>Subject</th>
            <th style={thStyle}>Teacher</th>
            {/* THIS IS THE UPDATED TABLE HEADER */}
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Section</th>
          </tr>
        </thead>
        <tbody>
          {routines.length > 0 ? (
            routines.map(item => (
              <tr key={item._id}>
                <td style={tdStyle}>{item.day}</td><td style={tdStyle}>{item.time}</td>
                <td style={tdStyle}>{item.subject}</td><td style={tdStyle}>{item.teacher}</td>
                {/* THIS IS THE UPDATED TABLE DATA CELL */}
                <td style={tdStyle}>{item.department}</td>
                <td style={tdStyle}>{item.section}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{...tdStyle, textAlign: 'center'}}>No routines have been added yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}