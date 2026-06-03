// api/delete-component.js
export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { componentName } = req.body;

  if (!componentName) {
    return res.status(400).json({ 
      success: false, 
      message: 'Thiếu tên component cần xóa' 
    });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ 
      success: false, 
      message: 'Chưa cấu hình GITHUB_TOKEN hoặc GITHUB_REPO' 
    });
  }

  const fileName = `${componentName}.jsx`;
  const filePath = `src/components/${fileName}`;

  try {
    // Bước 1: Lấy SHA của file (bắt buộc để xóa)
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    if (!getFileResponse.ok) {
      const errData = await getFileResponse.json();
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy file ${fileName} trên GitHub: ${errData.message}`
      });
    }

    const fileData = await getFileResponse.json();
    const fileSha = fileData.sha;

    // Bước 2: Xóa file bằng DELETE request
    const deleteResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify({
          message: `🗑️ Delete page component: ${fileName}`,
          sha: fileSha,
          branch: GITHUB_BRANCH
        })
      }
    );

    const deleteData = await deleteResponse.json();

    if (!deleteResponse.ok) {
      return res.status(deleteResponse.status).json({
        success: false,
        message: `Không xóa được file: ${deleteData.message}`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Đã xóa file ${fileName} trên GitHub. Vercel sẽ tự động rebuild!`,
      commitSha: deleteData.commit?.sha
    });

  } catch (error) {
    console.error('Error deleting component:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
}