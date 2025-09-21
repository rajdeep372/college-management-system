export default function HomePage() {
  const containerStyle = {
    textAlign: 'center',
    paddingTop: '100px',
  };

  const titleStyle = {
    fontSize: '3rem',
    color: '#00c6ff',
    textShadow: '0 0 10px #00c6ff',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to the School Management System</h1>
      <p>Navigate using the sidebar to manage students, attendance, and routines.</p>
    </div>
  );
}