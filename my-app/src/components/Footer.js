'use client';
import { useState, useEffect } from 'react';

// --- Self-Contained Child Component for the 3D Social Link Animation ---
const SocialLink = ({ href, children, title }) => {
    const [isHovered, setIsHovered] = useState(false);

    const linkStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(74, 74, 90, 0.5)',
        transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        transform: isHovered ? 'scale(1.15) translateY(-3px)' : 'scale(1)',
        boxShadow: isHovered ? '0 0 15px rgba(0, 198, 255, 0.6)' : 'none',
    };

    const iconStyle = {
        width: '20px',
        height: '20px',
        color: '#a0a0a0',
        transition: 'color 0.3s ease',
        ...(isHovered && { color: '#ffffff' }),
    };

    return (
        <a href={href} title={title} target="_blank" rel="noopener noreferrer" style={linkStyle}
           onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div style={iconStyle}>
                {children}
            </div>
        </a>
    );
};


// --- Main Footer Component ---
const Footer = () => {
  const [time, setTime] = useState(new Date());
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkScrollTop = () => {
      setShowScroll(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- STYLES ---
  const footerStyle = {
    position: 'relative',
    marginLeft: '250px', // Align with main content
    padding: '15px 30px', // Standard padding
    // Glassmorphism background with a subtle border
    backgroundColor: 'rgba(22, 22, 37, 0.7)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid #4a4a5a',
    // The main layout for the single line
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // Allows wrapping on very small screens
    gap: '20px',
  };
  
  const copyrightStyle = {
    color: '#a0a0a0',
    fontSize: '0.9rem',
  };

  const clockStyle = {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#a0a0a0',
    fontFamily: 'monospace',
    letterSpacing: '1px',
  };

  const socialLinksContainerStyle = {
    display: 'flex',
    gap: '12px',
  };

  const scrollTopButtonStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#00c6ff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 5px 15px rgba(0, 198, 255, 0.4)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    opacity: showScroll ? 1 : 0,
    transform: showScroll ? 'scale(1)' : 'scale(0)',
    zIndex: 1000,
  };

  return (
    <>
      <footer style={footerStyle}>
        <div style={copyrightStyle}>
            &copy; 2025 College Management System.
        </div>
        
        <div style={clockStyle}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div style={socialLinksContainerStyle}>
            {/* Add your actual social media links here */}
            <SocialLink href="https://www.linkedin.com/in/rajdeep-chatterjee-196761310?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
            </SocialLink>
            <SocialLink href="https://github.com/rajdeep372" title="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
            </SocialLink>
        </div>
      </footer>
      
      <button onClick={scrollToTop} style={scrollTopButtonStyle} title="Back to Top">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>
    </>
  );
};

export default Footer;