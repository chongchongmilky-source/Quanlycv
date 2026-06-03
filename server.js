const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// API tạo component mới
app.post('/api/create-component', async (req, res) => {
  const { name, path: pagePath, type } = req.body;
  
  // Format tên component (PascalCase)
  const componentName = name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  const fileName = `${componentName}.jsx`;
  const filePath = path.join(__dirname, 'src', 'components', fileName);
  
  // Template component
  const componentTemplate = `import React from 'react';

const ${componentName} = () => {
  return (
    <div>
      <h2>📄 ${name}</h2>
      <p>Đây là trang ${name}. Bắt đầu phát triển tại: <code>src/components/${fileName}</code></p>
    </div>
  );
};

export default ${componentName};
`;

  try {
    await fs.writeFile(filePath, componentTemplate, 'utf8');
    console.log(`✅ Created: ${filePath}`);
    
    res.json({
      success: true,
      message: `Đã tạo file: src/components/${fileName}`,
      componentName,
      fileName
    });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo file: ' + error.message
    });
  }
});

// API lấy danh sách components
app.get('/api/components', async (req, res) => {
  const componentsDir = path.join(__dirname, 'src', 'components');
  
  try {
    const files = await fs.readdir(componentsDir);
    const components = files
      .filter(file => file.endsWith('.jsx'))
      .map(file => file.replace('.jsx', ''));
    
    res.json({ success: true, components });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});