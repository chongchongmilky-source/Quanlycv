import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeLeadingEmoji } from '../utils/helpers.jsx';

const PageManager = ({ pages, setPages }) => {
  const [newPageName, setNewPageName] = useState('');
  const [newPagePath, setNewPagePath] = useState('');
  const [createComponent, setCreateComponent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Helper: Convert tên thành PascalCase cho component name
  const toPascalCase = (str) => {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

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
    const componentName = toPascalCase(cleanName);
    const newPage = {
      id: Date.now().toString(),
      name: cleanName,
      path: formattedPath,
      type: createComponent ? componentName : 'Generic',
      componentName: createComponent ? componentName : null    };

    // Nếu chọn tạo component, gọi API tạo file trên GitHub
    if (createComponent) {
      setLoading(true);
      try {
        const response = await fetch('/api/create-component', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            componentName: componentName,
            path: formattedPath
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          showNotification(`✅ Đã tạo component "${componentName}.jsx" trên GitHub!`, 'success');
        } else {
          showNotification(`❌ Lỗi: ${data.message || 'Không tạo được file component'}`, 'error');
          setLoading(false);
          return;
        }
      } catch (error) {
        showNotification('❌ Không thể kết nối backend server!', 'error');
        setLoading(false);
        return;
      }
    }
    
    setPages([...pages, newPage]);
    setNewPageName('');
    setNewPagePath('');
    setCreateComponent(false);
    setLoading(false);
    
    showNotification(`Đã thêm trang "${cleanName}" thành công!`);
  };

  const handleDeletePage = async (id, name, path, componentName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa trang "${name}"?${componentName ? '\n\n⚠️ File component "' + componentName + '.jsx" cũng sẽ bị XÓA khỏi GitHub!' : ''}`)) {
      return;
    }

    // Nếu có component, gọi API xóa file trên GitHub TRƯỚC
    if (componentName) {
      setLoading(true);
      try {        const response = await fetch('/api/delete-component', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            componentName: componentName,
            path: path
          })
        });
        
        const data = await response.json();
        
        if (!data.success) {
          showNotification(`⚠️ Xóa trang thành công nhưng KHÔNG xóa được file component: ${data.message}`, 'error');
          // Vẫn tiếp tục xóa trang khỏi state dù file component chưa xóa được
        } else {
          showNotification(`✅ Đã xóa trang và component "${componentName}.jsx" trên GitHub!`, 'success');
        }
      } catch (error) {
        showNotification('⚠️ Xóa trang thành công nhưng KHÔNG thể kết nối backend để xóa component!', 'error');
        // Vẫn tiếp tục xóa trang khỏi state
      }
    }

    const updatedPages = pages.filter(p => p.id !== id);
    setPages(updatedPages);
    
    if (location.pathname === path) {
      navigate('/');
    }
    
    if (!componentName) {
      showNotification(`Đã xóa trang "${name}" thành công!`);
    }
    
    setLoading(false);
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
        {loading && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>⏳ Đang xử lý...</span>}
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
              disabled={loading}
            />
            <span style={{ fontSize: '14px', color: '#333' }}>
              📝 Tạo file component riêng cho trang này
            </span>
          </label>
          <small style={{ color: '#666', marginLeft: '26px', display: 'block', marginTop: '4px' }}>
            Nếu chọn, hệ thống sẽ tạo file <code>src/components/{newPageName ? toPascalCase(newPageName) : 'TenTrang'}.jsx</code> trên GitHub
          </small>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Tên trang (VD: Báo cáo doanh thu)" 
            value={newPageName} 
            onChange={(e) => setNewPageName(e.target.value)} 
            style={{ flex: '1 1 300px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            disabled={loading}
          />          <input 
            type="text" 
            placeholder="Đường dẫn (VD: /bao-cao)" 
            value={newPagePath} 
            onChange={(e) => setNewPagePath(e.target.value)} 
            style={{ flex: '0 1 200px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              background: loading ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            {loading ? '⏳ Đang tạo...' : '+ Thêm Trang'}
          </button>
        </div>
      </form>
      
      <div>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>📋 Danh sách trang ({pages.length} trang)</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pages.map((page, index) => (
            <li key={page.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', marginBottom: '8px', borderRadius: '4px', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => moveUp(index)}
                  disabled={index === 0 || loading}
                  style={{
                    padding: '4px 8px',
                    background: index === 0 ? '#e2e8f0' : '#4299e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    opacity: index === 0 ? 0.5 : 1
                  }}
                >
                  ▲
                </button>
                <button 
                  onClick={() => moveDown(index)}                  disabled={index === pages.length - 1 || loading}
                  style={{
                    padding: '4px 8px',
                    background: index === pages.length - 1 ? '#e2e8f0' : '#4299e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: index === pages.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    opacity: index === pages.length - 1 ? 0.5 : 1
                  }}
                >
                  ▼
                </button>
              </div>
              <span style={{ flex: 1 }}>
                <strong>{page.name}</strong>
                <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', marginLeft: '10px' }}>{page.path}</code> 
                <small style={{ color: '#888', marginLeft: '8px' }}>
                  ({page.type})
                  {page.componentName && <span style={{ color: '#28a745' }}> → {page.componentName}.jsx</span>}
                </small>
              </span>
              {page.type !== 'Home' && page.type !== 'Manager' && (
                <button 
                  onClick={() => handleDeletePage(page.id, page.name, page.path, page.componentName)}
                  disabled={loading}
                  style={{ 
                    padding: '5px 10px', 
                    background: loading ? '#ccc' : '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: loading ? 'not-allowed' : 'pointer' 
                  }}
                >
                  Xóa
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PageManager;
