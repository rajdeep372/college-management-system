'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function StudentProfilePage({ params }) {
    const { id } = params;
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token && id) {
            const fetchProfile = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`, { headers: { 'x-auth-token': token } });
                    if (!res.ok) throw new Error('Failed to fetch student profile.');
                    const data = await res.json();
                    setProfile(data);

                    // Combine and sort attendance and messages into a single timeline
                    const attendanceEvents = (data.attendanceHistory || []).map(att => ({ ...att, type: 'attendance', date: new Date(att.date) }));
                    const messageEvents = (data.messages || []).map(msg => ({ ...msg, type: 'message', date: new Date(msg.createdAt) }));
                    const combined = [...attendanceEvents, ...messageEvents];
                    combined.sort((a, b) => b.date - a.date);
                    setTimeline(combined);
                } catch (err) { setError(err.message); } finally { setLoading(false); }
            };
            fetchProfile();
        }
    }, [token, id]);
    
    const overallAttendance = profile ? {
        total: profile.attendanceHistory.length,
        present: profile.attendanceHistory.filter(a => a.status === 'present').length,
    } : { total: 0, present: 0 };
    const attendancePercentage = overallAttendance.total > 0 ? Math.round((overallAttendance.present / overallAttendance.total) * 100) : 0;

    // --- STYLES ---
    const headerStyle = { fontSize: '2.5rem', color: '#e0e0e0', borderBottom: '2px solid #00c6ff', paddingBottom: '10px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    const backLinkStyle = { fontSize: '1rem', color: '#00c6ff', textDecoration: 'none' };
    const profileGridStyle = { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' };
    const leftColumnStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
    const profileCardStyle = { backgroundColor: '#161625', padding: '25px', borderRadius: '8px', border: '1px solid #4a4a5a' };
    const statCardStyle = { ...profileCardStyle, textAlign: 'center' };
    const statValueStyle = { fontSize: '2.5rem', fontWeight: 'bold', color: '#00c6ff', margin: '0 0 5px 0' };
    const statLabelStyle = { color: '#a0a0a0' };
    const detailItemStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#a0a0a0' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { backgroundColor: '#00c6ff', color: '#161625', padding: '12px 15px', textAlign: 'left' };
    const tdStyle = (status) => ({ padding: '12px 15px', borderBottom: '1px solid #4a4a5a', color: status === 'absent' ? '#ff4d4d' : 'inherit' });
    const messageStyle = { textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' };
    const tableContainerStyle = { maxHeight: '60vh', overflowY: 'auto' };
    const cardTitleStyle = { marginTop: 0, color: '#00c6ff', borderBottom: '1px solid #4a4a5a', paddingBottom: '10px' };

    if (loading) return <p style={messageStyle}>Loading Profile...</p>;
    if (error) return <p style={{ ...messageStyle, color: '#ff4d4d' }}>Error: {error}</p>;
    if (!profile) return null;

    return (
        <div>
            <div style={headerStyle}><span>{profile.student.name}'s Profile</span><Link href="/students" style={backLinkStyle}>&larr; Back to Student List</Link></div>
            <div style={profileGridStyle}>
                <div style={leftColumnStyle}>
                    <div style={profileCardStyle}><h3 style={cardTitleStyle}>Student Details</h3><div style={detailItemStyle}><span>Roll Number:</span> <strong>{profile.student.rollNumber}</strong></div><div style={detailItemStyle}><span>Department:</span> <strong>{profile.student.department}</strong></div><div style={detailItemStyle}><span>Section:</span> <strong>{profile.student.section}</strong></div></div>
                    <div style={statCardStyle}><p style={statValueStyle}>{profile.student.attendancePoints}</p><p style={statLabelStyle}>Attendance Points</p></div>
                    <div style={statCardStyle}><p style={statValueStyle}>{attendancePercentage}<small>%</small></p><p style={statLabelStyle}>Overall Attendance</p></div>
                </div>
                <div style={profileCardStyle}>
                    <h3 style={cardTitleStyle}>Unified History Timeline</h3>
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead><tr><th style={thStyle}>Date</th><th style={thStyle}>Event</th><th style={thStyle}>Details</th></tr></thead>
                            <tbody>
                                {timeline.length > 0 ? (
                                    timeline.map(item => {
                                        if (item.type === 'attendance') return (<tr key={`att-${item._id}`}><td style={tdStyle()}>{item.date.toLocaleDateString()}</td><td style={tdStyle(item.status)}><strong>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</strong></td><td style={tdStyle()}>{item.routine?.subject || 'N/A'}</td></tr>);
                                        if (item.type === 'message') return (<tr key={`msg-${item._id}`}><td style={tdStyle()}>{item.date.toLocaleDateString()}</td><td style={tdStyle()}><i>Message from {item.teacher?.name}</i></td><td style={tdStyle()}><i>{item.message}</i></td></tr>);
                                        return null;
                                    })
                                ) : (<tr><td colSpan="3" style={{...tdStyle(), textAlign: 'center'}}>No history found for this student.</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}