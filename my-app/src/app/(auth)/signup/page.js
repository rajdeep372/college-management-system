'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

const SignupPage = () => {
    // --- Your existing logic is unchanged ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Failed to sign up');
            }
            const data = await res.json();
            login(data.token);
        } catch (err) {
            setError(err.message);
        }
    };
    // --- End of unchanged logic ---


    // --- NEW: State for animations ---
    const [isVisible, setIsVisible] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // --- NEW: STYLES (Identical to login page for consistency) ---
    const keyframes = `
        @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;

    const pageStyle = {
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
        padding: '20px', background: 'linear-gradient(-45deg, #161625, #1a1a2e, #2a2a4e, #00c6ff)',
        backgroundSize: '400% 400%', animation: 'gradient-animation 15s ease infinite',
        marginLeft: '-250px',
    };

    const formContainerStyle = { perspective: '1000px' };

    const formStyle = {
        width: '400px', padding: '40px', borderRadius: '12px',
        backgroundColor: 'rgba(22, 22, 37, 0.6)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(74, 74, 90, 0.5)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        transformStyle: 'preserve-3d',
        transform: isVisible ? 'rotateX(0deg) translateY(0)' : 'rotateX(-10deg) translateY(30px)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
    };

    const inputStyle = { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #4a4a5a', backgroundColor: '#1a1a2e', color: '#e0e0e0', fontSize: '1rem', transition: 'box-shadow 0.3s, border-color 0.3s' };
    
    const buttonStyle = {
        width: '100%', padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#00c6ff',
        color: '#161625', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: isButtonHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isButtonHovered ? '0 0 20px rgba(0, 198, 255, 0.7)' : 'none',
    };

    const linkStyle = { color: '#00c6ff', textAlign: 'center', display: 'block', marginTop: '15px', textDecoration: 'none' };
    const errorStyle = { color: '#ff4d4d', textAlign: 'center', marginBottom: '10px' };
    const inputGroupStyle = { marginBottom: '20px' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#a0a0a0', fontSize: '0.9rem' };

    return (
        <>
            <style>{keyframes}</style>
            <div style={pageStyle}>
                <div style={formContainerStyle}>
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <h2 style={{ textAlign: 'center', color: '#e0e0e0', marginBottom: '30px' }}>Create Teacher Account</h2>
                        {error && <p style={errorStyle}>{error}</p>}
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={e => e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.5)'} onBlur={e => e.target.style.boxShadow = 'none'} required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} onFocus={e => e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.5)'} onBlur={e => e.target.style.boxShadow = 'none'} required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} onFocus={e => e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.5)'} onBlur={e => e.target.style.boxShadow = 'none'} required />
                        </div>
                        <button type="submit" style={buttonStyle} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}>Sign Up</button>
                        <Link href="/login" style={linkStyle}>Already have an account? Log In</Link>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignupPage;