import React from 'react';

const SettingsPage = () => {
  const handleReset = () => {
    if (window.confirm('⚠️ Hành động này sẽ XÓA TẤT CẢ dữ liệu và khôi phục về mặc định. Bạn có chắc chắn?')) {
      localStorage.removeItem('dashboard_tasks');
      localStorage.removeItem('dashboard_bugs');
      localStorage.removeItem('dashboard_projects');
      localStorage.removeItem('dashboard_pages');
      window.location.reload();
    }
  };

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>⚙️ Cài đặt Hệ Thống</h2>
      <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', padding: '20px', borderRadius: '8px', maxWidth: '600px' }}>
        <h3 style={{ marginTop: 0, color: '#856404' }}>🗑️ Vùng nguy hiểm</h3>
        <p style={{ color: '#856404', marginBottom: '15px' }}>Sử dụng chức năng này nếu bạn muốn xóa sạch toàn bộ dữ liệu đã nhập và bắt đầu lại từ đầu.</p>
        <button onClick={handleReset} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Khôi phục dữ liệu mặc định
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;