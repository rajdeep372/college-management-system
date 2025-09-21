'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// --- Self-Contained Component for the "Add Notice" Form ---
const AddNoticeForm = ({ onNoticeAdded, onCancel }) => {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ title, content }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.msg || 'Failed to post notice.');
            }
            const newNotice = await res.json();
            onNoticeAdded(newNotice);
        } catch (err) { setError(err.message); }
    };

    const formStyle = { padding: '30px', borderRadius: '12px', marginBottom: '2rem', backgroundColor: 'rgba(22, 22, 37, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(74, 74, 90, 0.5)' };
    const inputStyle = { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0', fontSize: '1rem', marginBottom: '15px' };
    const textAreaStyle = { ...inputStyle, minHeight: '120px', resize: 'vertical' };
    const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px' };
    const buttonStyle = (isPrimary) => ({ padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: isPrimary ? '#00c6ff' : '#4a4a5a', color: isPrimary ? '#161625' : '#e0e0e0' });

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2 style={{marginTop: 0, color: '#e0e0e0'}}>Create New Notice</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="Notice Title" required />
            <textarea value={content} onChange={e => setContent(e.target.value)} style={textAreaStyle} placeholder="Notice Content... (You can use multiple lines)" required />
            <div style={buttonContainerStyle}>
                <button type="button" onClick={onCancel} style={buttonStyle(false)}>Cancel</button>
                <button type="submit" style={buttonStyle(true)}>Post Notice</button>
            </div>
        </form>
    );
};

// --- Self-Contained Component for Displaying a Single Notice Card ---
const NoticeCard = ({ notice, isOwner, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardStyle = { backgroundColor: '#161625', padding: '25px', borderRadius: '8px', borderLeft: '4px solid #00c6ff', marginBottom: '20px', transition: 'transform 0.3s ease, box-shadow 0.3s ease', ...(isHovered && { transform: 'scale(1.03)', boxShadow: '0 10px 30px rgba(0, 198, 255, 0.2)' }) };
    const titleStyle = { marginTop: 0, color: 'white', fontSize: '1.5rem' };
    const contentStyle = { color: '#a0a0a0', whiteSpace: 'pre-wrap', lineHeight: '1.6' };
    const metaStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: '#a0a0a0', fontSize: '0.9rem' };
    const deleteButtonStyle = { padding: '5px 10px', border: 'none', borderRadius: '5px', backgroundColor: '#e53e3e', color: 'white', cursor: 'pointer', transition: 'background-color 0.2s' };

    return (
        <div style={cardStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <h3 style={titleStyle}>{notice.title}</h3>
            <p style={contentStyle}>{notice.content}</p>
            <div style={metaStyle}>
                {/* Use optional chaining here as well for safety */}
                <span>By: <strong>{notice.author?.name || 'Admin'}</strong> on {new Date(notice.createdAt).toLocaleDateString()}</span>
                {isOwner && <button onClick={() => onDelete(notice._id)} style={deleteButtonStyle}>Delete</button>}
            </div>
        </div>
    );
};


// --- Main Notice Board Page Component ---
export default function NoticeBoardPage() {
    const { token, user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (token) {
            const fetchNotices = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices`, { headers: { 'x-auth-token': token } });
                    if (!res.ok) throw new Error('Could not fetch notices.');
                    const data = await res.json();
                    setNotices(data);
                } catch (err) { setError(err.message); } finally { setLoading(false); }
            };
            fetchNotices();
        } else {
            setLoading(false); // If no token, stop loading
        }
    }, [token]);

    const handleNoticeAdded = (newNotice) => {
        setNotices(prev => [newNotice, ...prev]);
        setShowForm(false);
    };

    const handleNoticeDeleted = async (noticeId) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/${noticeId}`, { 
                method: 'DELETE', 
                headers: { 'x-auth-token': token } 
            });
            if (!res.ok) throw new Error("Failed to delete notice.");
            setNotices(prev => prev.filter(n => n._id !== noticeId));
        } catch (err) { setError(err.message); }
    };

    // --- STYLES ---
    const headerStyle = { fontSize: '2.5rem', color: '#e0e0e0', borderBottom: '2px solid #00c6ff', paddingBottom: '10px', marginBottom: '1rem' };
    const topControlsStyle = { display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' };
    const toggleButtonStyle = { padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#00c6ff', color: '#161625', fontWeight: 'bold', cursor: 'pointer' };
    const messageStyle = { textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' };

    if (loading) return <p style={messageStyle}>Loading Notices...</p>;
    if (error) return <p style={{ ...messageStyle, color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h1 style={headerStyle}>College Notice Board</h1>

            {user?.role === 'teacher' && (
                <div style={topControlsStyle}>
                    {!showForm && <button onClick={() => setShowForm(true)} style={toggleButtonStyle}>+ Post New Notice</button>}
                </div>
            )}

            {showForm && <AddNoticeForm onNoticeAdded={handleNoticeAdded} onCancel={() => setShowForm(false)} />}
            
            <div>
                {notices.length > 0 ? (
                    notices.map(notice => (
                        <NoticeCard 
                            key={notice._id} 
                            notice={notice}
                            // This is the corrected line that prevents the crash.
                            // The `?` safely checks if `notice.author` exists before trying to access `_id`.
                            isOwner={user?.id === notice.author?._id}
                            onDelete={handleNoticeDeleted}
                        />
                    ))
                ) : (
                    <p style={messageStyle}>There are currently no notices.</p>
                )}
            </div>
        </div>
    );
}