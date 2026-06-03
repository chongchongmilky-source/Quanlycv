import React, { useState, useEffect } from 'react';

const ProjectManager = () => {
  const defaultProjects = [
    { id: 1, name: 'Website Bán Hàng', description: 'Xây dựng frontend và backend', progress: 75 },
    { id: 2, name: 'App Mobile Nội bộ', description: 'Quản lý chấm công nhân viên', progress: 30 },
  ];
  
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('dashboard_projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  });
  
  useEffect(() => {
    localStorage.setItem('dashboard_projects', JSON.stringify(projects));
  }, [projects]);

  const [newProj, setNewProj] = useState({ name: '', description: '' });

  const addProject = (e) => {
    e.preventDefault();
    if (!newProj.name.trim()) return;
    setProjects([...projects, { id: Date.now(), name: newProj.name, description: newProj.description, progress: 0 }]);
    setNewProj({ name: '', description: '' });
  };

  const deleteProject = (id) => setProjects(projects.filter(p => p.id !== id));

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>📁 Quản lý Dự án</h2>
      <form onSubmit={addProject} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px', maxWidth: '500px' }}>
        <input type="text" placeholder="Tên dự án..." value={newProj.name} onChange={e => setNewProj({...newProj, name: e.target.value})} style={{ padding: '8px' }} />
        <input type="text" placeholder="Mô tả ngắn..." value={newProj.description} onChange={e => setNewProj({...newProj, description: e.target.value})} style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 15px', background: '#673ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start' }}>Tạo dự án mới</button>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
        {projects.map(proj => (
          <div key={proj.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'relative' }}>
            <button onClick={() => deleteProject(proj.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '18px' }}>×</button>
            <h3 style={{ margin: '0 0 10px 0', color: '#673ab7' }}>{proj.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{proj.description}</p>
            <div style={{ background: '#eee', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${proj.progress}%`, background: '#673ab7', height: '100%', transition: 'width 0.3s' }}></div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#888', marginTop: '5px' }}>{proj.progress}% hoàn thành</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;