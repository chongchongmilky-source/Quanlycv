// api/create-component.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, componentName, path: pagePath } = req.body;

  if (!name || !componentName) {
    return res.status(400).json({ 
      success: false, 
      message: 'Thiếu tên trang hoặc tên component' 
    });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // format: "username/repo-name"
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ 
      success: false, 
      message: 'Chưa cấu hình GITHUB_TOKEN hoặc GITHUB_REPO trên Vercel' 
    });
  }

  const fileName = `${componentName}.jsx`;
  const filePath = `src/components/${fileName}`;

  const componentTemplate = `import React from 'react';

const ${componentName} = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📄 ${name}</h2>
      <p>Đây là trang "${name}". File được tạo tự động qua GitHub API.</p>
      <p>Đường dẫn: <code>${pagePath}</code></p>
      <p>Bắt đầu code tại: <code>src/components/${fileName}</code></p>
    </div>
  );
};

export default ${componentName};
`;

  try {
    // Mã hóa nội dung file sang base64 (yêu cầu của GitHub API)
    const contentBase64 = Buffer.from(componentTemplate, 'utf8').toString('base64');

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify({
          message: `✨ Add new page: ${name} (${fileName})`,
          content: contentBase64,
          branch: GITHUB_BRANCH
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub API error:', data);
      return res.status(response.status).json({
        success: false,
        message: `GitHub API lỗi: ${data.message || 'Unknown error'}`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Đã tạo file ${filePath} trên GitHub. Vercel sẽ tự động build!`,
      fileName,
      componentName,
      commitSha: data.commit?.sha
    });

  } catch (error) {
    console.error('Error creating component:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
}