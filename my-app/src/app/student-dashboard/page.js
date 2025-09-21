'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// --- This is a new, self-contained component to handle the card animations ---
const AnimatedCard = ({ children, delay }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entry animation with a delay
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const cardStyle = {
        padding: '25px',
        borderRadius: '12px',
        // Glassmorphism
        backgroundColor: 'rgba(22, 22, 37, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(74, 74, 90, 0.5)',
        // 3D & Animation
        transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out, opacity 0.5s ease-out',
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        ...(isHovered && {
            transform: 'scale(1.03) rotateX(5deg) translateY(-10px)',
            boxShadow: '0 15px 30px rgba(0, 198, 255, 0.2)',
        }),
    };

    return (
        <div style={cardStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {children}
        </div>
    );
};


export default function StudentDashboardPage() {
    // --- All of your existing logic is unchanged ---
    const { user, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [routine, setRoutine] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token && user?.studentId) {
            const fetchDashboardData = async () => {
                try {
                    const [profileRes, routinesRes] = await Promise.all([
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${user.studentId}`, { headers: { 'x-auth-token': token } }),
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines`)
                    ]);
                    if (!profileRes.ok) throw new Error('Failed to load your profile data.');
                    if (!routinesRes.ok) throw new Error('Failed to load the college routine.');
                    const profileData = await profileRes.json();
                    const allRoutines = await routinesRes.json();
                    setProfile(profileData);
                    setMessages(profileData.messages || []);
                    setRoutine(allRoutines.filter(r => r.department === profileData.student.department && r.section === profileData.student.section));
                } catch (err) { console.error("Dashboard fetch error:", err); setError(err.message); } finally { setLoading(false); }
            };
            fetchDashboardData();
        } else { setLoading(false); }
    }, [token, user]);
    // --- End of unchanged logic ---


    // --- NEW: STYLES (with animations and 3D effects) ---
    const headerStyle = { fontSize: '2.5rem', color: '#e0e0e0', borderBottom: '2px solid #00c6ff', paddingBottom: '10px', marginBottom: '2rem' };
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' };
    const fullWidthCardStyle = { gridColumn: '1 / -1', marginTop: '0' }; // To make a card span the full width
    const cardTitleStyle = { marginTop: 0, color: '#00c6ff', borderBottom: '1px solid #4a4a5a', paddingBottom: '10px', marginBottom: '20px' };
    const detailItemStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#a0a0a0', fontSize: '0.9rem' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse' };
    const thStyle = { backgroundColor: 'transparent', color: '#00c6ff', padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #4a4a5a' };
    const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #4a4a5a' };
    const messageStyle = { textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' };
    const tableContainerStyle = { maxHeight: '40vh', overflowY: 'auto' };
    const messageCardStyle = { backgroundColor: '#1a1a2e', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '3px solid #00c6ff' };
    const messageTextStyle = { margin: 0, color: 'white' };
    const messageMetaStyle = { margin: '5px 0 0', color: '#a0a0a0', fontSize: '0.8rem' };


    if (loading) return <p style={messageStyle}>Loading Your Dashboard...</p>;
    if (error) return <p style={{...messageStyle, color: 'red'}}>Error: {error}</p>;
    if (!profile) return <p style={messageStyle}>Welcome! Please log in to see your dashboard.</p>;

    return (
        <div style={{ perspective: '1500px' }}>
            <h1 style={headerStyle}>Welcome, {profile.student.name}</h1>
            <div style={gridStyle}>
                <AnimatedCard delay={100}>
                    <h2 style={cardTitleStyle}>My Details</h2>
                    <div style={detailItemStyle}><span>Roll Number:</span> <strong>{profile.student.rollNumber}</strong></div>
                    <div style={detailItemStyle}><span>Department:</span> <strong>{profile.student.department}</strong></div>
                    <div style={detailItemStyle}><span>Section:</span> <strong>{profile.student.section}</strong></div>
                    <div style={detailItemStyle}><span>Attendance Points:</span> <strong style={{color: '#00c6ff', fontSize: '1.2rem'}}>{profile.student.attendancePoints}</strong></div>
                </AnimatedCard>
                <AnimatedCard delay={200}>
                    <h2 style={cardTitleStyle}>My Weekly Routine</h2>
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead><tr><th style={thStyle}>Day</th><th style={thStyle}>Time</th><th style={thStyle}>Subject</th></tr></thead>
                            <tbody>
                                {routine.length > 0 ? routine.map(r => (
                                    <tr key={r._id}><td style={tdStyle}>{r.day}</td><td style={tdStyle}>{r.time}</td><td style={tdStyle}>{r.subject}</td></tr>
                                )) : <tr><td colSpan="3" style={{...tdStyle, textAlign: 'center'}}>No routine found for your class.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </AnimatedCard>
                <AnimatedCard delay={300} style={fullWidthCardStyle}>
                    <h2 style={cardTitleStyle}>Messages from Teachers</h2>
                    <div style={tableContainerStyle}>
                        {messages.length > 0 ? (
                            messages.map(msg => (
                                <div key={msg._id} style={messageCardStyle}>
                                    <p style={messageTextStyle}>{msg.message}</p>
                                    <p style={messageMetaStyle}>
                                        From: <strong>{msg.teacher?.name || 'A Teacher'}</strong> on {new Date(msg.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p style={{color: '#a0a0a0', textAlign: 'center'}}>You have no new messages.</p>
                        )}
                    </div>
                </AnimatedCard>
            </div>
        </div>
    );
}