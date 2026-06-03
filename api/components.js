// api/components.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ 
      success: false, 
      message: 'Chưa cấu hình GitHub env variables' 
    });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/src/components?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Không lấy được danh sách component'
      });
    }

    const files = await response.json();
    const components = files
      .filter(f => f.name.endsWith('.jsx'))
      .map(f => f.name.replace('.jsx', ''));

    return res.status(200).json({ success: true, components });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}