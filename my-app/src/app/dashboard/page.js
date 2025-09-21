'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- NEW: A simpler and more reliable AnimatedNumber component ---
const AnimatedNumber = ({ value, suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        if (start === end) return;
        
        // Use requestAnimationFrame for smoother animation
        let animationFrameId;
        const animate = () => {
            start += (end - start) * 0.1; // Easing effect
            if (Math.abs(end - start) < 0.5) {
                start = end;
                setDisplayValue(Math.round(start));
                cancelAnimationFrame(animationFrameId);
                return;
            }
            setDisplayValue(Math.round(start));
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [value]);

    return <span>{displayValue}{suffix}</span>;
};

// --- Main TeacherDashboardPage Component ---
export default function TeacherDashboardPage() {
  const { token } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [stats, setStats] = useState({ totalStudents: 0, attendanceToday: 0 });
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      const fetchDashboardData = async () => {
        try {
          const [teacherRes, statsRes, routinesRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers: { 'x-auth-token': token } }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, { headers: { 'x-auth-token': token } }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/routines`)
          ]);

          if (!teacherRes.ok || !statsRes.ok || !routinesRes.ok) throw new Error('Failed to fetch dashboard data');
          
          const teacherData = await teacherRes.json();
          const statsData = await statsRes.json();
          const allRoutines = await routinesRes.json();

          setTeacher(teacherData);
          setStats(statsData);
          
          // --- THIS IS THE CORRECTED FILTERING LOGIC ---
          // It is no longer case-sensitive and handles partial names (e.g., "Rajdeep" matches "Mr. Rajdeep")
          const teacherName = teacherData.name.trim().toLowerCase();
          setRoutines(allRoutines.filter(r => r.teacher.trim().toLowerCase().includes(teacherName)));
          
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [token]);
  
  // Chart.js data configuration
  const chartData = {
      labels: routines.map(r => `${r.subject} (${r.day.substring(0,3)})`),
      datasets: [{
          label: 'Your Assigned Classes',
          data: routines.map(() => 1), // This just creates a bar for each class
          backgroundColor: 'rgba(0, 198, 255, 0.6)',
          borderColor: 'rgba(0, 198, 255, 1)',
          borderWidth: 1,
          borderRadius: 4,
      }]
  };
  const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: { display: false },
          title: { display: true, text: "Your Weekly Schedule Overview", color: '#a0a0a0', font: { size: 14 } }
      },
      scales: {
          y: { display: false, beginAtZero: true, max: 1.2 },
          x: { ticks: { color: '#a0a0a0' } }
      }
  };

  // --- STYLES ---
  const headerStyle = { fontSize: '2.5rem', color: '#e0e0e0', borderBottom: '2px solid #00c6ff', paddingBottom: '10px', marginBottom: '2rem' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' };
  const cardStyle = { backgroundColor: 'rgba(22, 22, 37, 0.6)', backdropFilter: 'blur(10px)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(74, 74, 90, 0.5)' };
  const fullWidthCardStyle = { ...cardStyle, gridColumn: '1 / -1' };
  const cardTitleStyle = { marginTop: 0, color: '#00c6ff', borderBottom: '1px solid #4a4a5a', paddingBottom: '10px', marginBottom: '20px' };
  const statValueStyle = { fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', margin: 0 };
  const statLabelStyle = { color: '#a0a0a0', marginTop: '5px' };
  const profileDetailStyle = { color: '#a0a0a0', marginBottom: '10px' };
  const messageStyle = { textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' };

  if (loading) return <p style={messageStyle}>Loading Your Dashboard...</p>;
  if (error) return <p style={{ ...messageStyle, color: 'red' }}>Error: {error}</p>;
  if (!teacher) return <p style={messageStyle}>Could not load your profile. Please log in again.</p>;

  return (
    <div>
      <h1 style={headerStyle}>Welcome, {teacher.name}</h1>
      
      <div style={gridStyle}>
        <div style={cardStyle}>
            <h2 style={cardTitleStyle}>College Snapshot</h2>
            <div style={{textAlign: 'center'}}>
                <p style={statValueStyle}><AnimatedNumber value={stats.totalStudents} /></p>
                <p style={statLabelStyle}>Total Students in College</p>
            </div>
            <div style={{textAlign: 'center', marginTop: '30px'}}>
                <p style={statValueStyle}><AnimatedNumber value={stats.attendanceToday} suffix="%" /></p>
                <p style={statLabelStyle}>College-Wide Attendance Today</p>
            </div>
        </div>

        <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Your Profile</h2>
            <div style={{fontSize: '1.1rem'}}>
                <p style={profileDetailStyle}><strong>Name:</strong> {teacher.name}</p>
                <p style={profileDetailStyle}><strong>Email:</strong> {teacher.email}</p>
                <p style={profileDetailStyle}><strong>Role:</strong> <span style={{textTransform: 'capitalize'}}>{teacher.role}</span></p>
                <p style={profileDetailStyle}><strong>Classes Assigned:</strong> {routines.length}</p>
            </div>
        </div>

        <div style={fullWidthCardStyle}>
            <div style={{ height: '300px' }}> {/* Give the chart a specific height */}
              <Bar options={chartOptions} data={chartData} />
            </div>
        </div>
      </div>
    </div>
  );
};