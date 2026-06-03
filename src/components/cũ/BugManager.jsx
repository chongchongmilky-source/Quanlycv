import React, { useState, useEffect } from 'react';

const SEV = {
  'Nghiêm trọng': { bg: '#fff5f5', color: '#c53030', dot: '#fc8181' },
  'Trung bình':   { bg: '#fffbeb', color: '#b7791f', dot: '#f6ad55' },
  'Nhẹ':          { bg: '#f0fff4', color: '#276749', dot: '#68d391' },
};

const STATUS = {
  'Chưa sửa':    { bg: '#fff5f5', color: '#c53030' },
  'Đang xử lý':  { bg: '#ebf8ff', color: '#2b6cb0' },
  'Đã sửa':      { bg: '#f0fff4', color: '#276749' },
  'Không tái hiện': { bg: '#faf5ff', color: '#6b46c1' },
};

const defaultBugs = [
  { id: 1, title: 'Lỗi hiển thị trên mobile', severity: 'Nghiêm trọng', status: 'Chưa sửa', reporter: '', steps: '', note: '', createdAt: '2025-01-01' },
  { id: 2, title: 'Nút submit không phản hồi', severity: 'Trung bình', status: 'Đã sửa', reporter: '', steps: '', note: '', createdAt: '2025-01-02' },
];

const S = {
  wrap: { fontFamily: "'Be Vietnam Pro', sans-serif" },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title: { margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a202c', display: 'flex', alignItems: 'center', gap: '10px' },
  stats: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  stat: (c) => ({ padding: '7px 14px', borderRadius: '8px', background: c + '15', border: `1px solid ${c}30`, fontSize: '12.5px', fontWeight: 600, color: c }),
  formBox: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  formLabel: { fontSize: '10.5px', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13.5px', outline: 'none', background: '#f8fafc', color: '#2d3748', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#f8fafc', color: '#2d3748', resize: 'vertical', minHeight: '64px', boxSizing: 'border-box', fontFamily: 'inherit' },
  select: { padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13.5px', background: '#f8fafc', color: '#2d3748', cursor: 'pointer' },
  btn: (bg, fg = 'white') => ({ padding: '9px 18px', background: bg, color: fg, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600 }),
  toolbar: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' },
  chip: (active) => ({ padding: '5px 13px', border: `1px solid ${active ? '#4299e1' : '#e2e8f0'}`, borderRadius: '20px', background: active ? '#ebf8ff' : 'white', color: active ? '#2b6cb0' : '#718096', fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer' }),
  row: { display: 'grid', gap: '12px' },
  card: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  cardTop: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  badge: (meta) => ({ padding: '2px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: meta.bg, color: meta.color, whiteSpace: 'nowrap' }),
  iconBtn: (c) => ({ padding: '5px 9px', background: c + '15', border: `1px solid ${c}30`, color: c, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }),
  meta: { fontSize: '12px', color: '#a0aec0', display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' },
};

export default function BugManager() {
  const [bugs, setBugs] = useState(() => {
    const saved = localStorage.getItem('dashboard_bugs');
    if (saved) return JSON.parse(saved).map(b => ({ reporter: '', steps: '', note: '', createdAt: '', status: b.status || 'Chưa sửa', ...b }));
    return defaultBugs;
  });
  useEffect(() => { localStorage.setItem('dashboard_bugs', JSON.stringify(bugs)); }, [bugs]);

  const [form, setForm] = useState({ title: '', severity: 'Trung bình', reporter: '', steps: '', note: '' });
  const [showForm, setShowForm] = useState(false);
  const [filterSev, setFilterSev] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bugImages, setBugImages] = useState(() => {
  const saved = localStorage.getItem('dashboard_bug_images');
  return saved ? JSON.parse(saved) : {};
});

useEffect(() => { 
  localStorage.setItem('dashboard_bug_images', JSON.stringify(bugImages)); 
}, [bugImages]);
  const [expandId, setExpandId] = useState(null);

  const add = () => {
  if (!form.title.trim()) return;
  const newBug = { 
    id: Date.now(), 
    ...form, 
    status: 'Chưa sửa', 
    createdAt: new Date().toISOString().slice(0, 10) 
  };
  setBugs([newBug, ...bugs]);
  
  // Lưu ảnh nếu có
  if (form.bugImage) {
    setBugImages(prev => ({
      ...prev,
      [newBug.id]: { bugImage: form.bugImage }
    }));
  }
  
  setForm({ title: '', severity: 'Trung bình', reporter: '', steps: '', note: '', bugImage: '' });
  setShowForm(false);
};

  
  const del = (id) => { setBugs(bugs.filter(b => b.id !== id)); setDeleteConfirm(null); };
const changeStatus = (id, status) => {
  const updates = { status };
  if (status === 'Đã sửa') {
    updates.completedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
  }
  setBugs(bugs.map(b => b.id === id ? { ...b, ...updates } : b));
};
  let visible = bugs.filter(b => {
    const ms = filterSev === 'Tất cả' || b.severity === filterSev;
    const mst = filterStatus === 'Tất cả' || b.status === filterStatus;
    const mq = !search || b.title.toLowerCase().includes(search.toLowerCase());
    return ms && mst && mq;
  });

  const stats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'Chưa sửa').length,
    inProgress: bugs.filter(b => b.status === 'Đang xử lý').length,
    fixed: bugs.filter(b => b.status === 'Đã sửa').length,
    critical: bugs.filter(b => b.severity === 'Nghiêm trọng' && b.status !== 'Đã sửa').length,
  }
    const handleImageUpload = (bugId, file, type) => {
  if (!file) return;
  
  const reader = new FileReader();
  reader.onloadend = () => {
    setBugImages(prev => ({
      ...prev,
      [bugId]: {
        ...prev[bugId],
        [type]: reader.result
      }
    }));
  };
  reader.readAsDataURL(file);
};

const deleteImage = (bugId, type) => {
  setBugImages(prev => {
    const updated = { ...prev };
    if (updated[bugId]) {
      delete updated[bugId][type];
    }
    return updated;
  });
};
  };

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <h2 style={S.title}> Quản lý Lỗi (Bug)</h2>
        <div style={S.stats}>
          <span style={S.stat('#4299e1')}>{stats.total} Tổng</span>
          <span style={S.stat('#fc8181')}>{stats.open} Chưa sửa</span>
          <span style={S.stat('#ed8936')}>{stats.inProgress} Đang xử lý</span>
          <span style={S.stat('#48bb78')}>{stats.fixed} Đã sửa</span>
          {stats.critical > 0 && <span style={S.stat('#e53e3e')}>{stats.critical} Nghiêm trọng</span>}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <button style={S.btn('#e53e3e')} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Đóng' : '+ Báo lỗi mới'}
        </button>
      </div>

      {showForm && (
        <div style={S.formBox}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#4a5568', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Báo lỗi mới</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={S.formLabel}>Mô tả lỗi *</label>
              <input style={S.input} placeholder="Tên / mô tả ngắn gọn..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} onKeyDown={e => e.key === 'Enter' && add()} />
            </div>
            <div>
              <label style={S.formLabel}>Mức độ</label>
              <select style={{ ...S.select, width: '100%' }} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                <option>Nghiêm trọng</option><option>Trung bình</option><option>Nhẹ</option>
              </select>
            </div>
            <div>
              <label style={S.formLabel}>Người báo</label>
              <input style={S.input} placeholder="Tên người phát hiện..." value={form.reporter} onChange={e => setForm({ ...form, reporter: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={S.formLabel}>Các bước tái hiện</label>
              <textarea style={S.textarea} placeholder="1. Mở trang... 2. Click vào... 3. Lỗi xuất hiện..." value={form.steps} onChange={e => setForm({ ...form, steps: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={S.formLabel}>Ghi chú thêm</label>
              <input style={S.input} placeholder="Môi trường, phiên bản, ảnh chụp..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
  <label style={S.formLabel}>Ảnh lỗi (chụp màn hình)</label>
  <input 
    type="file" 
    accept="image/*" 
    onChange={e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm({ ...form, bugImage: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }}
    style={{ fontSize: '13px', color: '#4a5568' }}
  />
</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={S.btn('#e53e3e')} onClick={add}>Báo lỗi</button>
            <button style={S.btn('#e2e8f0', '#4a5568')} onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={S.toolbar}>
        <input style={{ ...S.input, flex: '1 1 180px', padding: '8px 12px' }} placeholder="🔍 Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Tất cả', 'Nghiêm trọng', 'Trung bình', 'Nhẹ'].map(s => (
            <button key={s} style={S.chip(filterSev === s)} onClick={() => setFilterSev(s)}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Tất cả', 'Chưa sửa', 'Đang xử lý', 'Đã sửa', 'Không tái hiện'].map(s => (
            <button key={s} style={S.chip(filterStatus === s)} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Bug list */}
      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#a0aec0' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
          <div>Không có lỗi nào cần xử lý</div>
        </div>
      ) : visible.map(bug => (
        <div key={bug.id} style={S.card}>
          <div style={S.cardTop}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: SEV[bug.severity]?.dot, flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#2d3748' }}>{bug.title}</span>
                <span style={S.badge(SEV[bug.severity] || SEV['Nhẹ'])}>{bug.severity}</span>
              </div>
              <div style={S.meta}>
                <select
                  style={{ ...S.badge(STATUS[bug.status] || STATUS['Chưa sửa']), border: 'none', cursor: 'pointer', fontSize: '11.5px' }}
                  value={bug.status}
                  onChange={e => changeStatus(bug.id, e.target.value)}
                >
                  <option>Chưa sửa</option>
                  <option>Đang xử lý</option>
                  <option>Đã sửa</option>
                  <option>Không tái hiện</option>
                </select>
                {bug.reporter && <span>👤 {bug.reporter}</span>}
                {bug.createdAt && <span>📅 {bug.createdAt}</span>}
                {bug.completedAt && <span style={{ color: '#48bb78', fontWeight: 600 }}>✅ {bug.completedAt}</span>}
                {bug.status === 'Đã sửa' && (
  <div style={{ marginTop: '8px', width: '100%' }}>
    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '4px' }}>
      📸 Ảnh hoàn thành:
    </label>
    <input 
      type="file" 
      accept="image/*"
      onChange={e => handleImageUpload(bug.id, e.target.files[0], 'completedImage')}
      style={{ fontSize: '12px' }}
    />
  </div>
)}
                {(bug.steps || bug.note) && (
                  <button style={{ background: 'none', border: 'none', color: '#4299e1', fontSize: '12px', cursor: 'pointer', padding: 0 }} onClick={() => setExpandId(expandId === bug.id ? null : bug.id)}>
                    {expandId === bug.id ? '▲ Thu gọn' : '▼ Chi tiết'}
                  </button>
                )}
              </div>
              {expandId === bug.id && (
                <div style={{ marginTop: '10px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#4a5568' }}>
                  {bug.steps && <div style={{ marginBottom: '8px' }}><strong>Các bước tái hiện:</strong><br /><pre style={{ whiteSpace: 'pre-wrap', margin: '4px 0 0', fontFamily: 'inherit' }}>{bug.steps}</pre></div>}
                  {bug.note && <div><strong>Ghi chú:</strong> {bug.note}</div>}
                  {/* Hiển thị ảnh lỗi */}
{bugImages[bug.id]?.bugImage && (
  <div style={{ marginTop: '10px' }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>
      📸 Ảnh lỗi:
    </div>
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img 
        src={bugImages[bug.id].bugImage} 
        alt="Bug screenshot" 
        style={{ maxWidth: '200px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
      />
      <button 
        onClick={() => deleteImage(bug.id, 'bugImage')}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          background: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        ×
      </button>
    </div>
  </div>
)}

{/* Hiển thị ảnh hoàn thành */}
{bugImages[bug.id]?.completedImage && (
  <div style={{ marginTop: '10px' }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>
      ✅ Ảnh hoàn thành:
    </div>
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img 
        src={bugImages[bug.id].completedImage} 
        alt="Completed" 
        style={{ maxWidth: '200px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
      />
      <button 
        onClick={() => deleteImage(bug.id, 'completedImage')}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          background: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        ×
      </button>
    </div>
  </div>
)}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              {deleteConfirm === bug.id ? (
                <>
                  <button style={S.iconBtn('#e53e3e')} onClick={() => del(bug.id)}>Xóa?</button>
                  <button style={S.iconBtn('#a0aec0')} onClick={() => setDeleteConfirm(null)}>Không</button>
                </>
              ) : (
                <button style={S.iconBtn('#fc8181')} onClick={() => setDeleteConfirm(bug.id)}>🗑</button>
              )}
            </div>
          </div>
        </div>
      ))}
      {visible.length > 0 && (
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>
          Hiển thị {visible.length}/{bugs.length} lỗi
        </div>
      )}
    </div>
  );
}
