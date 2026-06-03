import React from 'react';

const RESET_GROUPS = [
  {
    key: 'tasks',
    title: '📋 Công việc',
    description: 'Khôi phục danh sách công việc về mặc định.',
    keys: ['dashboard_tasks'],
  },
  {
    key: 'bugs',
    title: ' Lỗi',
    description: 'Khôi phục danh sách lỗi và ảnh lỗi về mặc định.',
    keys: ['dashboard_bugs', 'dashboard_bug_images'],
  },
  {
    key: 'projects',
    title: '📁 Dự án',
    description: 'Khôi phục danh sách dự án về mặc định.',
    keys: ['dashboard_projects'],
  },
  {
    key: 'spaced-repetition',
    title: '🧠 Học lặp lại',
    description: 'Xóa toàn bộ dữ liệu học lặp lại để bắt đầu lại từ đầu.',
    keys: ['spaced_repetition_data'],
  },
  {
    key: 'pages',
    title: '🛠️ Cấu trúc trang',
    description: 'Khôi phục danh sách trang về cấu hình mặc định.',
    keys: ['dashboard_pages'],
  },
];

const ALL_RESET_KEYS = Array.from(
  new Set(RESET_GROUPS.flatMap((group) => group.keys))
);

function clearStorageKeys(keys) {
  keys.forEach((key) => localStorage.removeItem(key));
  window.location.reload();
}

const SettingsPage = () => {
  const handleResetGroup = (group) => {
    const ok = window.confirm(
      `⚠️ Hành động này sẽ khôi phục mục "${group.title}" về mặc định. Bạn có chắc chắn?`
    );
    if (!ok) return;
    clearStorageKeys(group.keys);
  };

  const handleResetAll = () => {
    const ok = window.confirm(
      '⚠️ Hành động này sẽ khôi phục TẤT CẢ dữ liệu các trang về mặc định. Bạn có chắc chắn?'
    );
    if (!ok) return;
    clearStorageKeys(ALL_RESET_KEYS);
  };

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>
        ⚙️ Cài đặt Hệ Thống
      </h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '20px' }}>
        Chọn khôi phục từng trang riêng lẻ hoặc xóa toàn bộ dữ liệu để trở về trạng thái mặc định.
      </p>

      <div
        style={{
          background: '#fff3cd',
          border: '1px solid #ffeeba',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '760px',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#856404' }}>🗑️ Vùng nguy hiểm</h3>
        <p style={{ color: '#856404', marginBottom: '15px' }}>
          Dữ liệu đang được lưu local. Các nút bên dưới sẽ chỉ đặt lại dữ liệu tương ứng, không ảnh hưởng đến các phần khác.
        </p>

        <button
          onClick={handleResetAll}
          style={{
            padding: '10px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Khôi phục toàn bộ dữ liệu mặc định
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          maxWidth: '900px',
        }}
      >
        {RESET_GROUPS.map((group) => (
          <div
            key={group.key}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '16px' }}>
              {group.title}
            </h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5, marginTop: 0 }}>
              {group.description}
            </p>
            <button
              onClick={() => handleResetGroup(group)}
              style={{
                padding: '8px 14px',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Khôi phục mục này
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
