import React, { useState, useEffect } from 'react';

const TaskManager = () => {
  const defaultTasks = [
    { id: 1, title: 'Hoàn thiện giao diện Dashboard', priority: 'Cao', done: false },
    { id: 2, title: 'Viết tài liệu hướng dẫn', priority: 'Thấp', done: true },
  ];
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('dashboard_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });
  
  useEffect(() => {
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Trung bình');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTask, priority, done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>📋 Quản lý Công việc</h2>
      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px', maxWidth: '600px' }}>
        <input type="text" placeholder="Tên công việc..." value={newTask} onChange={e => setNewTask(e.target.value)} style={{ flex: 1, padding: '8px' }} />
        <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: '8px' }}>
          <option>Cao</option><option>Trung bình</option><option>Thấp</option>
        </select>
        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Thêm</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, maxWidth: '800px' }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#fff', marginBottom: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} style={{ marginRight: '10px', transform: 'scale(1.2)' }} />
            <span style={{ flex: 1, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#888' : '#333' }}>{task.title}</span>
            <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '12px', background: task.priority === 'Cao' ? '#ffebee' : task.priority === 'Thấp' ? '#e8f5e9' : '#fff3e0', color: task.priority === 'Cao' ? '#c62828' : task.priority === 'Thấp' ? '#2e7d32' : '#ef6c00', marginRight: '10px' }}>
              {task.priority}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ background: '#ff5252', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;