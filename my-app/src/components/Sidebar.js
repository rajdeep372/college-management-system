'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

// --- SVG Icons (with the new 'notice' icon added) ---
const icons = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  students: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  attendance: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  routine: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  reports: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20V16"/></svg>,
  notice: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  login: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>,
};

// The self-contained NavItem component for handling animations and state
const NavItem = ({ href, text, icon, isActive, isMounted, delay, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const linkStyle = { display: 'flex', alignItems: 'center', textDecoration: 'none', padding: '15px 20px', marginBottom: '10px', borderRadius: '8px', color: isActive ? '#00c6ff' : 'white', backgroundColor: isActive ? 'rgba(0, 198, 255, 0.1)' : 'transparent', border: '1px solid transparent', borderColor: isActive ? 'rgba(0, 198, 255, 0.3)' : 'transparent', boxShadow: isActive ? '0 0 15px rgba(0, 198, 255, 0.2)' : 'none', transition: 'all 0.3s ease', transitionDelay: `${delay}ms`, transformStyle: 'preserve-3d', transform: isMounted ? 'translateX(0)' : 'translateX(-100%)', opacity: isMounted ? 1 : 0, ...(isHovered && { transform: 'scale(1.05) translateZ(10px)', backgroundColor: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }) };
  const iconStyle = { marginRight: '15px', transition: 'transform 0.3s ease', transform: isHovered ? 'scale(1.1)' : 'scale(1)' };
  const content = (<div style={linkStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}><span style={iconStyle}>{icon}</span><span>{text}</span></div>);
  return onClick ? (<button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, width: '100%', cursor: 'pointer', textAlign: 'left' }}>{content}</button>) : (<Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>);
};


const Sidebar = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sidebarStyle = { width: '250px', backgroundColor: '#161625', color: 'white', padding: '20px', height: '100vh', position: 'fixed', top: 0, left: 0, borderRight: '1px solid #4a4a5a', display: 'flex', flexDirection: 'column', perspective: '800px', zIndex: 100 };
  const logoStyle = { textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2.5rem', color: '#00c6ff', textShadow: '0 0 10px rgba(0, 198, 255, 0.7)' };
  
  // The correct and complete list of links for teachers
  const teacherNavItems = [
    { href: "/dashboard", text: "Dashboard", icon: icons.dashboard },
    { href: "/students", text: "Students", icon: icons.students },
    { href: "/attendance", text: "Attendance", icon: icons.attendance },
    { href: "/routine", text: "Routine", icon: icons.routine },
    { href: "/reports", text: "Reports", icon: icons.reports },
    { href: "/notice-board", text: "Notice Board", icon: icons.notice },
  ];

  // The correct and complete list of links for students
  const studentNavItems = [
    { href: "/student-dashboard", text: "My Dashboard", icon: icons.dashboard },
    { href: "/notice-board", text: "Notice Board", icon: icons.notice },
  ];

  return (
    <aside style={sidebarStyle}>
      <div style={{ flexGrow: 1 }}>
        <div style={logoStyle}>CollegeAdmin</div>
        <nav>
          {/* Conditionally render the correct navigation based on user role */}
          {user?.role === 'teacher' && teacherNavItems.map((item, index) => (
            <NavItem key={item.href} {...item} isActive={pathname === item.href} isMounted={isMounted} delay={index * 100} />
          ))}
          
          {user?.role === 'student' && studentNavItems.map((item, index) => (
            <NavItem key={item.href} {...item} isActive={pathname === item.href} isMounted={isMounted} delay={index * 100} />
          ))}
        </nav>
      </div>
      <div>
        {isAuthenticated ? (
          <NavItem
            text="Logout"
            icon={icons.logout}
            onClick={logout}
            isMounted={isMounted}
            delay={500}
          />
        ) : (
          // Show separate login links when logged out
          <>
            <NavItem
              href="/login"
              text="Teacher Login"
              icon={icons.login}
              isActive={pathname === '/login'}
              isMounted={isMounted}
              delay={0}
            />
            <NavItem
              href="/student-login"
              text="Student Login"
              icon={icons.students}
              isActive={pathname === '/student-login'}
              isMounted={isMounted}
              delay={100}
            />
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;