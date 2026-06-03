import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { renderIcon, removeLeadingEmoji } from './utils/helpers.jsx';

// Import các component cố định
import HomePage from './components/HomePage';
import TaskManager from './components/TaskManager';
import BugManager from './components/BugManager';
import ProjectManager from './components/ProjectManager';
import SettingsPage from './components/SettingsPage';
import PageManager from './components/PageManager';

// Component fallback khi đang load
const LoadingComponent = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '60vh',
    gap: '12px',
    color: '#718096'
  }}>
    <span style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }}>⏳</span>
    <span>Đang tải trang...</span>
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Component mặc định cho trang động
const GenericPage = ({ page }) => (
  <div style={{ padding: '20px' }}>
    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
      {renderIcon(page.type)} {page.name}
    </h2>
    <p>Trang "{page.name}" đang được phát triển.</p>
    <p style={{ color: '#718096', fontSize: '14px' }}>
      Component: <code>src/components/{page.componentName || page.type}.jsx</code>
    </p>
  </div>
);

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');
{ box-sizing: border-box; margin: 0; padding: 0; }
:root {
--sidebar-bg: #0f1623;
--sidebar-border: rgba(255,255,255,0.06);
--sidebar-hover: rgba(255,255,255,0.05);
--sidebar-active: rgba(99,179,237,0.15);
--sidebar-active-border: #63b3ed;
--text-primary: #e2e8f0;
--text-muted: #718096;
--accent: #63b3ed;
--accent-soft: rgba(99,179,237,0.2);
--header-bg: #ffffff;
--body-bg: #f0f4f8;
--card-bg: #ffffff;
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
--shadow-md: 0 4px 16px rgba(0,0,0,0.08);
--radius: 10px;
--font: 'Be Vietnam Pro', sans-serif;
}
body { font-family: var(--font); background: var(--body-bg); }
.layout { display: flex; min-height: 100vh; width: 100vw; position: relative; }
/* Overlay for mobile */
.overlay {
display: none;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0,0,0,0.5);
z-index: 40;    opacity: 0;
transition: opacity 0.3s ease;
}
.overlay.active {
display: block;
opacity: 1;
}
/* ── Sidebar ── */
.sidebar {
width: 240px;
min-width: 240px;
background: var(--sidebar-bg);
display: flex;
flex-direction: column;
height: 100vh;
position: sticky;
top: 0;
overflow-y: auto;
border-right: 1px solid var(--sidebar-border);
transition: transform 0.3s ease;
z-index: 50;
}
.sidebar-brand {
padding: 24px 20px 20px;
border-bottom: 1px solid var(--sidebar-border);
display: flex;
align-items: center;
gap: 10px;
}
.brand-icon {
width: 34px;
height: 34px;
background: linear-gradient(135deg, #63b3ed, #4299e1);
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
font-size: 16px;
flex-shrink: 0;
}
.brand-text {
font-size: 14px;
font-weight: 700;
color: var(--text-primary);
letter-spacing: 0.02em;    line-height: 1.3;
}
.brand-sub {
font-size: 10px;
font-weight: 400;
color: var(--text-muted);
letter-spacing: 0.05em;
text-transform: uppercase;
}
.sidebar-section-label {
padding: 16px 20px 6px;
font-size: 10px;
font-weight: 600;
color: var(--text-muted);
letter-spacing: 0.1em;
text-transform: uppercase;
}
.nav { padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
.nav-link {
display: flex;
align-items: center;
gap: 10px;
padding: 9px 12px;
border-radius: 7px;
color: #94a3b8;
text-decoration: none;
font-size: 13.5px;
font-weight: 500;
transition: all 0.18s ease;
border-left: 2px solid transparent;
position: relative;
overflow: hidden;
}
.nav-link:hover {
background: var(--sidebar-hover);
color: var(--text-primary);
}
.nav-link.active {
background: var(--sidebar-active);
color: var(--accent);
border-left-color: var(--sidebar-active-border);
font-weight: 600;
}
.nav-icon {
width: 20px;
height: 20px;
display: flex;
align-items: center;
justify-content: center;
font-size: 15px;
flex-shrink: 0;
}
.sidebar-footer {
padding: 16px 20px;
border-top: 1px solid var(--sidebar-border);
display: flex;
align-items: center;
gap: 10px;
}
.user-avatar {
width: 32px;
height: 32px;
background: linear-gradient(135deg, #667eea, #764ba2);
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
color: white;
font-weight: 700;
font-size: 13px;
flex-shrink: 0;
}
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.user-role { font-size: 11px; color: var(--text-muted); }
/* ── Main content ── */
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.header {
background: var(--header-bg);
padding: 0 20px;
height: 60px;
display: flex;
justify-content: space-between;
align-items: center;
box-shadow: var(--shadow-sm);
border-bottom: 1px solid #e8edf2;
position: sticky;
top: 0;    z-index: 30;
}
.header-left {
display: flex;
align-items: center;
gap: 12px;
}
.menu-toggle {
display: none;
background: none;
border: none;
font-size: 24px;
cursor: pointer;
padding: 4px;
color: #2d3748;
border-radius: 6px;
transition: background 0.2s;
}
.menu-toggle:hover {
background: #f7fafc;
}
.header-title {
font-size: 15px;
font-weight: 600;
color: #2d3748;
letter-spacing: 0.01em;
}
.header-right { display: flex; align-items: center; gap: 12px; }
.header-badge {
padding: 4px 12px;
background: #ebf8ff;
color: #2b6cb0;
border-radius: 20px;
font-size: 12px;
font-weight: 600;
border: 1px solid #bee3f8;
}
.content {
padding: 20px;
flex: 1;
background: var(--body-bg);
overflow-y: auto;
}
.not-found {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 60vh;
gap: 12px;
color: var(--text-muted);
}
.not-found h2 { font-size: 20px; color: #4a5568; }
.not-found p { font-size: 14px; }
/* ── Mobile Responsive ── */
@media (max-width: 768px) {
.sidebar {
position: fixed;
left: 0;
top: 0;
height: 100vh;
transform: translateX(-100%);
box-shadow: var(--shadow-md);
}
.sidebar.open {
  transform: translateX(0);
}

.menu-toggle {
  display: block;
}

.header {
  padding: 0 16px;
}

.header-title {
  font-size: 14px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  padding: 16px;
}

.header-badge {      display: none;
}

.brand-text {
  font-size: 13px;
}

.brand-sub {
  display: none;
}
}
@media (max-width: 480px) {
.header-title {
font-size: 13px;
max-width: 150px;
}
.user-info {
  display: none;
}

.sidebar-footer {
  justify-content: center;
  padding: 12px 20px;
}

.nav-link {
  font-size: 14px;
  padding: 10px 12px;
}
}
`;

const MainLayout = ({ pages, setPages }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  // Hàm dynamic import component
  const getComponentForPage = (page) => {
    // Các component cố định
    const fixedComponents = {
      'Home': HomePage,
      'Settings': SettingsPage,
      'Manager': PageManager,
      'Tasks': TaskManager,
      'Bugs': BugManager,
      'Projects': ProjectManager
    };

    // Nếu là component cố định, return ngay
    if (fixedComponents[page.type]) {
      return fixedComponents[page.type];
    }

    // Nếu có componentName, thử dynamic import
    if (page.componentName) {
      try {
        // Dynamic import với React.lazy
        return lazy(() => 
          import(`./components/${page.componentName}.jsx`)
            .then(module => ({ default: module.default }))
            .catch(() => {
              console.warn(`Component ${page.componentName} not found, using GenericPage`);
              return { default: () => <GenericPage page={page} /> };
            })
        );
      } catch (error) {
        console.error(`Error loading component ${page.componentName}:`, error);
        return () => <GenericPage page={page} />;
      }
    }

    // Fallback: Generic page
    return () => <GenericPage page={page} />;
  };

  const currentPage = pages.find(p => p.path === location.pathname);
  const CurrentComponent = currentPage ? getComponentForPage(currentPage) : null;

  return (
    <>
      <style>{styles}</style>
      <div className="overlay" onClick={closeSidebar}></div>
      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <div className="brand-icon">🚀</div>
            <div>
              <div className="brand-text">Admin Dashboard</div>
              <div className="brand-sub">Hệ thống quản lý</div>
            </div>
          </div>

          <div className="sidebar-section-label">Điều hướng</div>

          <nav className="nav">
            {pages.map(page => (
              <Link
                key={page.id}
                to={page.path}
                className={`nav-link${location.pathname === page.path ? ' active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">{renderIcon(page.type)}</span>
                {page.name}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-role">Quản trị viên</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="header">
            <div className="header-left">
              <button className="menu-toggle" onClick={toggleSidebar}>
                ☰
              </button>
              <span className="header-title">
                {currentPage ? currentPage.name : 'Hệ thống Quản lý Tổng hợp'}
              </span>
            </div>
            <div className="header-right">
              <span className="header-badge">● Trực tuyến</span>
            </div>
          </header>

          <div className="content">
            <Routes>
              {pages.map(page => {
                const PageComponent = getComponentForPage(page);
                return (
                  <Route 
                    key={page.id} 
                    path={page.path} 
                    element={
                      <Suspense fallback={<LoadingComponent />}>
                        <PageComponent />
                      </Suspense>
                    } 
                  />
                );
              })}
              <Route path="*" element={
                <div className="not-found">
                  <span style={{ fontSize: '48px' }}>🔍</span>
                  <h2>404 — Trang không tồn tại</h2>
                  <p>Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </>
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