import React, { useState, useEffect, useRef } from 'react';

const S = {
  wrap: { fontFamily: "'Be Vietnam Pro', sans-serif" },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title: { display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a202c' },
  stats: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  statCard: (color) => ({ padding: '8px 16px', borderRadius: '8px', background: color + '15', border: `1px solid ${color}30`, fontSize: '13px', fontWeight: 600, color }),
  formBox: { background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '14px', fontWeight: 700, color: '#4a5568', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  row: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' },
  input: { flex: '1 1 200px', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13.5px', outline: 'none', background: '#f8fafc', color: '#2d3748' },
  select: { padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13.5px', background: '#f8fafc', color: '#2d3748', cursor: 'pointer' },
  btn: (bg, color = 'white') => ({ padding: '9px 18px', background: bg, color, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }),
  toolbar: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' },
  filterBtn: (active) => ({ padding: '6px 14px', border: `1px solid ${active ? '#4299e1' : '#e2e8f0'}`, borderRadius: '20px', background: active ? '#ebf8ff' : 'white', color: active ? '#2b6cb0' : '#718096', fontSize: '12.5px', fontWeight: active ? 600 : 400, cursor: 'pointer' }),
  taskCard: (done) => ({ background: done ? '#f8fafc' : 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', opacity: done ? 0.7 : 1, transition: 'all 0.15s' }),
  checkbox: { width: '18px', height: '18px', accentColor: '#4299e1', cursor: 'pointer', flexShrink: 0, marginTop: '2px' },
  taskTitle: (done) => ({ fontWeight: 500, fontSize: '14px', color: done ? '#a0aec0' : '#2d3748', textDecoration: done ? 'line-through' : 'none', flex: 1, lineHeight: 1.5 }),
  taskMeta: { fontSize: '12px', color: '#a0aec0', marginTop: '4px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
  badge: (bg, color) => ({ padding: '2px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 600, background: bg, color, whiteSpace: 'nowrap' }),
  actions: { display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'flex-start' },
  iconBtn: (color) => ({ padding: '5px 8px', background: color + '15', border: `1px solid ${color}30`, color, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }),
  editInput: { padding: '5px 8px', border: '1px solid #4299e1', borderRadius: '6px', fontSize: '13px', flex: 1, outline: 'none' },
  empty: { textAlign: 'center', padding: '48px 20px', color: '#a0aec0' },
};

const PRIORITY_META = {
  'Cao':      { bg: '#fff5f5', color: '#c53030', label: 'Cao' },
  'Trung bình':{ bg: '#fffbeb', color: '#b7791f', label: 'TB' },
  'Thấp':     { bg: '#f0fff4', color: '#276749', label: 'Thấp' },
};

const STATUS_META = {
  'Chờ':       { bg: '#edf2f7', color: '#4a5568' },
  'Đang làm':  { bg: '#ebf8ff', color: '#2b6cb0' },
  'Hoàn thành':{ bg: '#f0fff4', color: '#276749' },
};

const defaultTasks = [
  { id: 1, title: 'Hoàn thiện giao diện Dashboard', priority: 'Cao', status: 'Đang làm', done: false, deadline: '', assignee: '', note: '' },
  { id: 2, title: 'Viết tài liệu hướng dẫn', priority: 'Thấp', status: 'Hoàn thành', done: true, deadline: '', assignee: '', note: '' },
];

export default function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('dashboard_tasks');
    if (saved) {
      return JSON.parse(saved).map(t => ({ status: t.done ? 'Hoàn thành' : 'Chờ', deadline: '', assignee: '', note: '', ...t }));
    }
    return defaultTasks;
  });

  useEffect(() => { localStorage.setItem('dashboard_tasks', JSON.stringify(tasks)); }, [tasks]);

  const [form, setForm] = useState({ title: '', priority: 'Trung bình', status: 'Chờ', deadline: '', assignee: '', note: '' });
  const [filterPriority, setFilterPriority] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const add = () => {
    if (!form.title.trim()) return;
    setTasks([{ id: Date.now(), ...form, done: form.status === 'Hoàn thành' }, ...tasks]);
    setForm({ title: '', priority: 'Trung bình', status: 'Chờ', deadline: '', assignee: '', note: '' });
    setShowForm(false);
  };

  const toggle = (id) => setTasks(tasks.map(t =>
    t.id === id ? { ...t, done: !t.done, status: !t.done ? 'Hoàn thành' : 'Đang làm' } : t
  ));

  const del = (id) => { setTasks(tasks.filter(t => t.id !== id)); setDeleteConfirm(null); };

  const saveEdit = (id) => {
    if (!editTitle.trim()) return;
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editTitle } : t));
    setEditId(null);
  };

  const changeStatus = (id, status) => setTasks(tasks.map(t =>
    t.id === id ? { ...t, status, done: status === 'Hoàn thành' } : t
  ));

  // Filter + sort
  let visible = tasks.filter(t => {
    const matchP = filterPriority === 'Tất cả' || t.priority === filterPriority;
    const matchS = filterStatus === 'Tất cả' || t.status === filterStatus;
    const matchQ = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchP && matchS && matchQ;
  });
  if (sortBy === 'newest') visible = [...visible].reverse();
  if (sortBy === 'priority') {
    const order = { 'Cao': 0, 'Trung bình': 1, 'Thấp': 2 };
    visible = [...visible].sort((a, b) => order[a.priority] - order[b.priority]);
  }
  if (sortBy === 'deadline') visible = [...visible].sort((a, b) => (a.deadline || 'z') > (b.deadline || 'z') ? 1 : -1);

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.done).length,
    doing: tasks.filter(t => t.status === 'Đang làm').length,
    high: tasks.filter(t => t.priority === 'Cao' && !t.done).length,
  };

  const isOverdue = (t) => t.deadline && !t.done && new Date(t.deadline) < new Date();

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={S.header}>
        <h2 style={S.title}>📋 Quản lý Công việc</h2>
        <div style={S.stats}>
          <span style={S.statCard('#4299e1')}>{stats.total} Tổng</span>
          <span style={S.statCard('#48bb78')}>{stats.done} Xong</span>
          <span style={S.statCard('#ed8936')}>{stats.doing} Đang làm</span>
          {stats.high > 0 && <span style={S.statCard('#fc8181')}>{stats.high} Ưu tiên cao</span>}
        </div>
      </div>

      {/* Add form toggle */}
      <div style={{ marginBottom: '16px' }}>
        <button style={S.btn('#4299e1')} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Đóng' : '+ Thêm công việc'}
        </button>
      </div>

      {showForm && (
        <div style={S.formBox}>
          <div style={S.formTitle}>Công việc mới</div>
          <div style={S.row}>
            <input style={{ ...S.input, flex: '2 1 300px' }} placeholder="Tên công việc *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} onKeyDown={e => e.key === 'Enter' && add()} />
            <input style={{ ...S.input, flex: '1 1 150px' }} placeholder="Người phụ trách" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} />
          </div>
          <div style={S.row}>
            <select style={S.select} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option>Cao</option><option>Trung bình</option><option>Thấp</option>
            </select>
            <select style={S.select} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Chờ</option><option>Đang làm</option><option>Hoàn thành</option>
            </select>
            <input type="date" style={S.select} value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div style={{ ...S.row, marginBottom: 0 }}>
            <input style={{ ...S.input, flex: '1 1 100%' }} placeholder="Ghi chú..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
            <button style={S.btn('#4299e1')} onClick={add}>Thêm</button>
            <button style={S.btn('#e2e8f0', '#4a5568')} onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={S.toolbar}>
        <input style={{ ...S.input, flex: '1 1 180px', marginBottom: 0 }} placeholder="🔍 Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Tất cả', 'Cao', 'Trung bình', 'Thấp'].map(p => (
            <button key={p} style={S.filterBtn(filterPriority === p)} onClick={() => setFilterPriority(p)}>{p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Tất cả', 'Chờ', 'Đang làm', 'Hoàn thành'].map(s => (
            <button key={s} style={S.filterBtn(filterStatus === s)} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <select style={{ ...S.select, fontSize: '12.5px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="priority">Ưu tiên</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>📭</div>
          <div>Không có công việc nào</div>
        </div>
      ) : (
        visible.map(task => (
          <div key={task.id} style={{ ...S.taskCard(task.done), border: isOverdue(task) ? '1px solid #fc8181' : '1px solid #e2e8f0' }}>
            <input type="checkbox" style={S.checkbox} checked={task.done} onChange={() => toggle(task.id)} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {editId === task.id ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input style={S.editInput} value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus onKeyDown={e => { if (e.key === 'Enter') saveEdit(task.id); if (e.key === 'Escape') setEditId(null); }} />
                  <button style={S.iconBtn('#48bb78')} onClick={() => saveEdit(task.id)}>✓</button>
                  <button style={S.iconBtn('#a0aec0')} onClick={() => setEditId(null)}>✕</button>
                </div>
              ) : (
                <div style={S.taskTitle(task.done)} onDoubleClick={() => { setEditId(task.id); setEditTitle(task.title); }}>
                  {task.title}
                  {isOverdue(task) && <span style={{ marginLeft: '6px', fontSize: '11px', color: '#fc8181' }}>⚠ Quá hạn</span>}
                </div>
              )}
              <div style={S.taskMeta}>
                <span style={S.badge(PRIORITY_META[task.priority]?.bg, PRIORITY_META[task.priority]?.color)}>{task.priority}</span>
                <select
                  style={{ ...S.badge(STATUS_META[task.status]?.bg, STATUS_META[task.status]?.color), border: 'none', cursor: 'pointer', fontSize: '11.5px' }}
                  value={task.status}
                  onChange={e => changeStatus(task.id, e.target.value)}
                >
                  <option>Chờ</option><option>Đang làm</option><option>Hoàn thành</option>
                </select>
                {task.deadline && <span>📅 {task.deadline}</span>}
                {task.assignee && <span>👤 {task.assignee}</span>}
                {task.note && <span style={{ color: '#718096' }}>💬 {task.note}</span>}
              </div>
            </div>
            <div style={S.actions}>
              {editId !== task.id && <button style={S.iconBtn('#4299e1')} title="Sửa" onClick={() => { setEditId(task.id); setEditTitle(task.title); }}>✏</button>}
              {deleteConfirm === task.id ? (
                <>
                  <button style={S.iconBtn('#e53e3e')} onClick={() => del(task.id)}>Xóa?</button>
                  <button style={S.iconBtn('#a0aec0')} onClick={() => setDeleteConfirm(null)}>Không</button>
                </>
              ) : (
                <button style={S.iconBtn('#fc8181')} onClick={() => setDeleteConfirm(task.id)}>🗑</button>
              )}
            </div>
          </div>
        ))
      )}
      {visible.length > 0 && (
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>
          Hiển thị {visible.length}/{tasks.length} công việc
        </div>
      )}
    </div>
  );
}
