import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { renderIcon, removeLeadingEmoji } from './utils/helpers.jsx';

// Import components
import HomePage from './components/HomePage';
import TaskManager from './components/TaskManager';
import BugManager from './components/BugManager';
import ProjectManager from './components/ProjectManager';
import SettingsPage from './components/SettingsPage';
import PageManager from './components/PageManager';

const MainLayout = ({ pages, setPages }) => {
  const location = useLocation();

  const renderComponent = (page) => {
    switch (page.type) {
      case 'Home': return <HomePage />;
      case 'Settings': return <SettingsPage />;
      case 'Manager': return <PageManager pages={pages} setPages={setPages} />;
      case 'Tasks': return <TaskManager />;
      case 'Bugs': return <BugManager />;
      case 'Projects': return <ProjectManager />;
      default: return (
        <div style={{ padding: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>
            {renderIcon(page.type)} {page.name}
          </h2>
          <p>Trang nội dung tổng quát.</p>
        </div>
      );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: 'Arial, sans-serif' }}>
      <aside style={{ width: '260px', minWidth: '260px', background: '#1a202c', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center', fontSize: '20px', borderBottom: '1px solid #2d3748', paddingBottom: '15px', color: 'white' }}>🚀 Admin Dashboard</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {pages.map(page => (
            <Link key={page.id} to={page.path} style={{
              padding: '12px 15px', color: '#cbd5e0', textDecoration: 'none', borderRadius: '6px',
              background: location.pathname === page.path ? '#2d3748' : 'transparent',
              fontWeight: location.pathname === page.path ? 'bold' : 'normal',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <span style={{ display: 'inline-flex', width: '24px', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {renderIcon(page.type)}
              </span>
              {page.name}
            </Link>
          ))}
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: 'white', padding: '15px 30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Hệ thống Quản lý Tổng hợp</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '35px', height: '35px', background: '#4299e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>A</div>
            <span>Admin</span>
          </div>
        </header>
        
        <div style={{ padding: '30px', flex: 1, background: '#f7fafc' }}>
          <Routes>
            {pages.map(page => <Route key={page.id} path={page.path} element={renderComponent(page)} />)}
            <Route path="*" element={<div style={{textAlign: 'center'}}><h2>❌ 404 - Trang không tồn tại</h2></div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  const defaultPages = [
    { id: '1', name: 'Trang chủ', path: '/', type: 'Home' },
    { id: '2', name: 'Quản lý Công việc', path: '/tasks', type: 'Tasks' },
    { id: '3', name: 'Quản lý Lỗi', path: '/bugs', type: 'Bugs' },
    { id: '4', name: 'Quản lý Dự án', path: '/projects', type: 'Projects' },
    { id: '5', name: 'Cài đặt', path: '/settings', type: 'Settings' },
    { id: '6', name: 'Quản lý Cấu trúc Trang', path: '/manager', type: 'Manager' },
  ];

  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('dashboard_pages');
    let loaded = saved ? JSON.parse(saved) : defaultPages;
    const cleaned = loaded.map(p => ({ ...p, name: removeLeadingEmoji(p.name) }));
    localStorage.setItem('dashboard_pages', JSON.stringify(cleaned));
    return cleaned;
  });

  useEffect(() => {
    localStorage.setItem('dashboard_pages', JSON.stringify(pages));
  }, [pages]);

  return (
    <Router>
      <MainLayout pages={pages} setPages={setPages} />
    </Router>
  );
}

export default App;
