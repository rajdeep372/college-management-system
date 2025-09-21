'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// --- Self-Contained Modal Component for Sending Messages ---
const MessageModal = ({ student, token, onClose, onMessageSent }) => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState({ error: '', success: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', success: '' });
        if (!message.trim()) {
            setStatus({ error: 'Message cannot be empty.', success: '' });
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${student._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ message }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.msg || 'Failed to send message.');
            }
            setStatus({ error: '', success: `Message sent to ${student.name} successfully!` });
            setMessage('');
            // Close the modal after a short delay to allow the user to see the success message
            setTimeout(() => {
                onMessageSent();
            }, 1500);
        } catch (err) {
            setStatus({ error: err.message, success: '' });
        }
    };

    // --- Styles for the Modal ---
    const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' };
    const modalStyle = { width: '90%', maxWidth: '500px', backgroundColor: 'rgba(22, 22, 37, 0.9)', border: '1px solid rgba(74, 74, 90, 0.5)', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' };
    const textAreaStyle = { width: '100%', padding: '10px', minHeight: '120px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0', fontSize: '1rem' };
    const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' };
    const buttonStyle = (isPrimary) => ({ padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: isPrimary ? '#00c6ff' : '#4a4a5a', color: isPrimary ? '#161625' : '#e0e0e0' });
    const messageStyle = { textAlign: 'center', padding: '10px', borderRadius: '5px', marginTop: '10px' };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <h2 style={{marginTop: 0, color: '#e0e0e0'}}>Send Message to {student.name}</h2>
                <form onSubmit={handleSubmit}>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} style={textAreaStyle} placeholder="Type your report or message..." required />
                    {status.error && <p style={{...messageStyle, color: 'red'}}>{status.error}</p>}
                    {status.success && <p style={{...messageStyle, color: 'lightgreen'}}>{status.success}</p>}
                    <div style={buttonContainerStyle}>
                        <button type="button" onClick={onClose} style={buttonStyle(false)}>Cancel</button>
                        <button type="submit" style={buttonStyle(true)}>Send</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Reports Page Component ---
export default function ReportsPage() {
    const { token } = useAuth();
    const [searchCriteria, setSearchCriteria] = useState({ department: '', section: '', attendanceOperator: 'gte', attendancePoints: '0' });
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`);
                if (!res.ok) return;
                const students = await res.json();
                setDepartments(['', ...new Set(students.map(s => s.department))]);
                setSections(['', ...new Set(students.map(s => s.section))]);
            } catch (err) { console.error("Failed to fetch filter options:", err); }
        };
        fetchFilters();
    }, []);

    const handleChange = (e) => setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setHasSearched(true);
        setSearchResults([]);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(searchCriteria),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.msg || 'Search request failed');
            }
            const data = await res.json();
            setSearchResults(data);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    const exportToCsv = () => {
        if (searchResults.length === 0) return;
        const headers = "Name,Roll Number,Section,Department,Attendance Points";
        const rows = searchResults.map(s => `"${s.name}","${s.rollNumber}","${s.section}","${s.department}",${s.attendancePoints}`);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `student_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const openMessageModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };
    const closeMessageModal = () => setIsModalOpen(false);

    // --- STYLES ---
    const headerStyle = { fontSize: '2.5rem', color: '#e0e0e0', borderBottom: '2px solid #00c6ff', paddingBottom: '10px', marginBottom: '2rem' };
    const formStyle = { backgroundColor: 'rgba(22, 22, 37, 0.6)', backdropFilter: 'blur(10px)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(74, 74, 90, 0.5)', marginBottom: '2rem' };
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'flex-end' };
    const labelStyle = { marginBottom: '8px', color: '#a0a0a0', display: 'block', fontSize: '0.9rem' };
    const inputStyle = { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0', fontSize: '1rem' };
    const buttonStyle = { width: '100%', padding: '12px', border: 'none', backgroundColor: '#00c6ff', color: '#161625', fontWeight: 'bold', fontSize: '1.1rem', borderRadius: '5px', cursor: 'pointer', transition: 'transform 0.2s ease' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { backgroundColor: '#00c6ff', color: '#161625', padding: '12px 15px', textAlign: 'left' };
    const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #4a4a5a' };
    const messageStyle = { textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' };
    const exportButtonStyle = { padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', fontWeight: 'bold', cursor: 'pointer', float: 'right', marginBottom: '1rem', transition: 'transform 0.2s ease' };
    const messageButtonStyle = { padding: '5px 10px', border: 'none', borderRadius: '5px', backgroundColor: '#3182ce', color: 'white', cursor: 'pointer' };


    return (
        <div>
            {isModalOpen && selectedStudent && (
                <MessageModal
                    student={selectedStudent}
                    token={token}
                    onClose={closeMessageModal}
                    onMessageSent={closeMessageModal}
                />
            )}
            
            <h1 style={headerStyle}>Advanced Search & Reports</h1>
            
            <form onSubmit={handleSearch} style={formStyle}>
                <div style={gridStyle}>
                    <div>
                        <label style={labelStyle}>Department</label>
                        <select name="department" value={searchCriteria.department} onChange={handleChange} style={inputStyle}>
                            {departments.map(d => <option key={d} value={d}>{d || 'Any Department'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Section</label>
                        <select name="section" value={searchCriteria.section} onChange={handleChange} style={inputStyle}>
                            {sections.map(s => <option key={s} value={s}>{s || 'Any Section'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Attendance Points</label>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <select name="attendanceOperator" value={searchCriteria.attendanceOperator} onChange={handleChange} style={{...inputStyle, flex: '2'}}>
                                <option value="gte">More than or equal to</option>
                                <option value="lte">Less than or equal to</option>
                                <option value="eq">Exactly</option>
                            </select>
                            <input type="number" name="attendancePoints" value={searchCriteria.attendancePoints} onChange={handleChange} style={{...inputStyle, flex: '1'}} />
                        </div>
                    </div>
                    <div>
                        <button type="submit" style={buttonStyle} disabled={loading} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
                            {loading ? 'Searching...' : 'Search Students'}
                        </button>
                    </div>
                </div>
            </form>

            {error && <p style={{...messageStyle, color: 'red', backgroundColor: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px'}}>{error}</p>}
            
            {hasSearched && !loading && (
                <div>
                    <button onClick={exportToCsv} style={exportButtonStyle} disabled={searchResults.length === 0} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
                        Export Results
                    </button>
                    <h2>Search Results ({searchResults.length} found)</h2>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Name</th><th style={thStyle}>Roll Number</th>
                                <th style={thStyle}>Department</th><th style={thStyle}>Points</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.length > 0 ? (
                                searchResults.map(student => (
                                    <tr key={student._id}>
                                        <td style={tdStyle}>{student.name}</td>
                                        <td style={tdStyle}>{student.rollNumber}</td>
                                        <td style={tdStyle}>{student.department}</td>
                                        <td style={tdStyle}>{student.attendancePoints}</td>
                                        <td style={tdStyle}>
                                            <button onClick={() => openMessageModal(student)} style={messageButtonStyle}>
                                                Send Message
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{...tdStyle, textAlign: 'center'}}>No students found matching your criteria.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}