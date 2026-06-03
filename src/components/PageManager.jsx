import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeLeadingEmoji } from '../utils/helpers.jsx';

const PageManager = ({ pages, setPages }) => {
  const [newPageName, setNewPageName] = useState('');
  const [newPagePath, setNewPagePath] = useState('');
  const [createComponent, setCreateComponent] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddPage = async (e) => {
    e.preventDefault();
    
    if (!newPageName.trim() || !newPagePath.trim()) {
      showNotification('Vui lòng nhập đủ tên và đường dẫn!', 'error');
      return;
    }
    
    const formattedPath = newPagePath.startsWith('/') ? newPagePath : `/${newPagePath}`;
    
    if (pages.some(p => p.path === formattedPath)) {
      showNotification('Đường dẫn này đã tồn tại!', 'error');
      return;
    }
    
    const cleanName = removeLeadingEmoji(newPageName);
    const newPage = {
      id: Date.now().toString(),
      name: cleanName,
      path: formattedPath,
      type: createComponent ? cleanName.replace(/\s+/g, '') : 'Generic'
    };

    // Nếu chọn tạo component, gọi API
    if (createComponent) {
      try {
        const response = await fetch('http://localhost:3001/api/create-component', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            path: formattedPath,
            type: newPage.type
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          showNotification(`✅ ${data.message}`, 'success');
        } else {
          showNotification('Lỗi khi tạo file component!', 'error');
          return;
        }
      } catch (error) {
        showNotification('Không thể kết nối backend server!', 'error');
        return;
      }
    }
    
    setPages([...pages, newPage]);
    setNewPageName('');
    setNewPagePath('');
    setCreateComponent(false);
    
    showNotification(`Đã thêm trang "${cleanName}" thành công!`);
  };

  const handleDeletePage = (id, name, path) => {
    if (window.confirm(`Bạn có chắc muốn xóa trang "${name}"?`)) {
      const updatedPages = pages.filter(p => p.id !== id);
      setPages(updatedPages);
      
      if (location.pathname === path) {
        navigate('/');
      }
      
      showNotification(`Đã xóa trang "${name}" thành công!`);
    }
  };
const movePage = (index, direction) => {
  const newPages = [...pages];
  const newIndex = index + direction;
  
  if (newIndex < 0 || newIndex >= pages.length) return;
  
  [newPages[index], newPages[newIndex]] = [newPages[newIndex], newPages[index]];
  setPages(newPages);
};

const moveUp = (index) => movePage(index, -1);
const moveDown = (index) => movePage(index, 1);
  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>
        🛠️ Quản lý Cấu trúc Trang
      </h2>
      
      {notification.show && (
        <div style={{
          padding: '12px 20px',
          marginBottom: '20px',
          borderRadius: '6px',
          background: notification.type === 'error' ? '#fee' : '#efe',
          color: notification.type === 'error' ? '#c33' : '#3c3',
          border: `1px solid ${notification.type === 'error' ? '#fcc' : '#cfc'}`
        }}>
          {notification.message}
        </div>
      )}
      
      <form onSubmit={handleAddPage} style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>➕ Thêm trang mới</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={createComponent}
              onChange={(e) => setCreateComponent(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', color: '#333' }}>
              📝 Tạo file component riêng cho trang này
            </span>
          </label>
          <small style={{ color: '#666', marginLeft: '26px', display: 'block', marginTop: '4px' }}>
            Nếu chọn, hệ thống sẽ tạo file trong <code>src/components/</code>
          </small>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Tên trang (VD: Báo cáo doanh thu)" 
            value={newPageName} 
            onChange={(e) => setNewPageName(e.target.value)} 
            style={{ flex: '1 1 300px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
          <input 
            type="text" 
            placeholder="Đường dẫn (VD: /bao-cao)" 
            value={newPagePath} 
            onChange={(e) => setNewPagePath(e.target.value)} 
            style={{ flex: '0 1 200px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Thêm Trang
          </button>
        </div>
      </form>
      
      {/* ... phần danh sách trang giữ nguyên ... */}
      <div>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>📋 Danh sách trang ({pages.length} trang)</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pages.map(page => (
            <li key={page.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', marginBottom: '8px', borderRadius: '4px', alignItems: 'center', gap: '10px' }}>
  <div style={{ display: 'flex', gap: '4px' }}>
    <button 
      onClick={() => moveUp(pages.indexOf(page))}
      disabled={pages.indexOf(page) === 0}
      style={{
        padding: '4px 8px',
        background: pages.indexOf(page) === 0 ? '#e2e8f0' : '#4299e1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: pages.indexOf(page) === 0 ? 'not-allowed' : 'pointer',
        fontSize: '12px',
        opacity: pages.indexOf(page) === 0 ? 0.5 : 1
      }}
    >
      ▲
    </button>
    <button 
      onClick={() => moveDown(pages.indexOf(page))}
      disabled={pages.indexOf(page) === pages.length - 1}
      style={{
        padding: '4px 8px',
        background: pages.indexOf(page) === pages.length - 1 ? '#e2e8f0' : '#4299e1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: pages.indexOf(page) === pages.length - 1 ? 'not-allowed' : 'pointer',
        fontSize: '12px',
        opacity: pages.indexOf(page) === pages.length - 1 ? 0.5 : 1
      }}
    >
      ▼
    </button>
  </div>
  <span>
    <strong>{page.name}</strong>
                <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', marginLeft: '10px' }}>{page.path}</code> 
                <small style={{color: '#888'}}>({page.type})</small>
              </span>
              {page.type !== 'Home' && page.type !== 'Manager' && (
                <button onClick={() => handleDeletePage(page.id, page.name, page.path)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PageManager;