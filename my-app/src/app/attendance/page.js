'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AttendancePage() {
    // State for data
    const [allStudents, setAllStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [dailyRoutine, setDailyRoutine] = useState([]); // To populate the class dropdown
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);

    // State for user filter selections
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedSection, setSelectedSection] = useState('All');
    const [selectedRoutineId, setSelectedRoutineId] = useState(''); // NEW: For the class dropdown
    const [searchTerm, setSearchTerm] = useState('');
    
    // State for UI and feedback
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useAuth();

    // 1. Fetch all initial data on load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const today = new Date().toLocaleString('en-us', { weekday: 'long' });
                const [studentsRes, routinesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines`)
                ]);

                if (!studentsRes.ok || !routinesRes.ok) throw new Error('Failed to load initial data');
                
                const studentsData = await studentsRes.json();
                const allRoutines = await routinesRes.json();

                setAllStudents(studentsData);
                setFilteredStudents(studentsData);

                // Populate filters
                setDailyRoutine(allRoutines.filter(r => r.day === today));
                setDepartments(['All', ...new Set(studentsData.map(s => s.department))]);
                setSections(['All', ...new Set(studentsData.map(s => s.section))]);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchInitialData();
    }, [token]);

    // 2. Apply all filters whenever a filter or search term changes
    useEffect(() => {
        let result = allStudents;
        if (selectedDept !== 'All') {
            result = result.filter(student => student.department === selectedDept);
        }
        if (selectedSection !== 'All') {
            result = result.filter(student => student.section === selectedSection);
        }
        if (searchTerm) {
            result = result.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredStudents(result);
    }, [searchTerm, selectedDept, selectedSection, allStudents]);

    // 3. Handle submission
    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        if (!selectedRoutineId) {
            setError("Please select a class/subject before submitting.");
            return;
        }
        if (Object.keys(attendance).length === 0) {
            setError("Please mark attendance for at least one student.");
            return;
        }

        const payload = {
            routineId: selectedRoutineId,
            date: new Date().toISOString().split('T')[0],
            studentStatuses: Object.keys(attendance).map(studentId => ({ studentId, status: attendance[studentId] })),
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to submit attendance");
            
            const selectedClass = dailyRoutine.find(r => r._id === selectedRoutineId);
            setSuccess(`Attendance for ${selectedClass.subject} submitted successfully!`);
            setAttendance({}); // Clear selections for next time
        } catch (err) {
            setError(err.message);
        }
    };

    // --- STYLES ---
    const headerStyle = { fontSize: '2.5rem', color: '#e0e0e0', borderBottom: '2px solid #00c6ff', paddingBottom: '10px', marginBottom: '1rem' };
    const controlsContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '2rem', padding: '20px', backgroundColor: '#161625', borderRadius: '8px' };
    const searchInputStyle = { gridColumn: '1 / -1', padding: '12px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0', fontSize: '1rem' };
    const selectStyle = { padding: '12px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0', fontSize: '1rem' };
    const studentListContainerStyle = { perspective: '1000px' };
    const studentRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#161625', border: '1px solid #4a4a5a', borderRadius: '8px', marginBottom: '10px', transition: 'transform 0.4s ease, box-shadow 0.4s ease' };
    const studentRowHoverStyle = { transform: 'scale(1.02) translateZ(10px)', boxShadow: '0 10px 20px rgba(0, 198, 255, 0.15)' };
    const attendanceButtonStyle = (isActive) => ({ padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px', backgroundColor: isActive ? '#00c6ff' : '#4a4a5a', color: isActive ? '#161625' : '#e0e0e0' });
    const submitButtonStyle = { display: 'block', width: '250px', margin: '30px auto', padding: '15px', borderRadius: '8px', border: 'none', backgroundColor: '#00c6ff', color: '#161625', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' };
    const messageStyle = { textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', padding: '10px', borderRadius: '5px' };

    const StudentRow = ({ student, status, onStatusChange }) => {
        const [isHovered, setIsHovered] = useState(false);
        return (
            <div style={{ ...studentRowStyle, ...(isHovered ? studentRowHoverStyle : {}) }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <div>
                    <p style={{ margin: 0, fontSize: '1.2rem' }}>{student.name}</p>
                    <p style={{ margin: 0, color: '#a0a0a0' }}>{student.rollNumber} - {student.department} - Sec {student.section}</p>
                </div>
                <div>
                    <button style={attendanceButtonStyle(status === 'present')} onClick={() => onStatusChange(student._id, 'present')}>Present</button>
                    <button style={attendanceButtonStyle(status === 'absent')} onClick={() => onStatusChange(student._id, 'absent')}>Absent</button>
                </div>
            </div>
        );
    };

    if (!token) return <p style={messageStyle}>Please log in to manage attendance.</p>;
    if (loading) return <p style={messageStyle}>Loading students...</p>;

    return (
        <div>
            <h1 style={headerStyle}>Take Attendance - {new Date().toLocaleDateString()}</h1>
            
            <div style={controlsContainerStyle}>
                <input type="text" placeholder="Search by name or roll number..." style={searchInputStyle} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select style={selectStyle} value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
                <select style={selectStyle} value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                    {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>
                {/* NEW: Dropdown to select the specific class session */}
                <select style={{ ...selectStyle, borderColor: selectedRoutineId ? '#4a4a5a' : '#e53e3e' }} value={selectedRoutineId} onChange={e => setSelectedRoutineId(e.target.value)} required>
                    <option value="">-- Select Class --</option>
                    {dailyRoutine.map(r => <option key={r._id} value={r._id}>{r.subject} ({r.time})</option>)}
                </select>
            </div>
            
            {error && <p style={{...messageStyle, color: '#ff4d4d', backgroundColor: 'rgba(255, 0, 0, 0.1)'}}>{error}</p>}
            {success && <p style={{...messageStyle, color: '#7cfc00', backgroundColor: 'rgba(0, 255, 0, 0.1)'}}>{success}</p>}
            
            <div style={studentListContainerStyle}>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <StudentRow key={student._id} student={student} status={attendance[student._id]} onStatusChange={(id, status) => setAttendance(prev => ({ ...prev, [id]: status }))} />
                    ))
                ) : (
                    <p style={messageStyle}>No students match your criteria.</p>
                )}
            </div>
            
            {filteredStudents.length > 0 && (
                <button onClick={handleSubmit} style={submitButtonStyle}>Submit Attendance</button>
            )}
        </div>
    );
}