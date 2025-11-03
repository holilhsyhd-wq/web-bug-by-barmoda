export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    const body = req.body || await req.json?.();
    const url = body?.url || '';
    if (!url || !url.includes('tiktok.com')) {
      res.status(400).json({ error: 'URL TikTok tidak valid.' });
      return;
    }

    const apiUrl = 'https://www.tikwm.com/api/?url=' + encodeURIComponent(url);
    const apiResp = await fetch(apiUrl, { method: 'GET' });
    const data = await apiResp.json();

    if (!apiResp.ok || data?.code !== 0) {
      console.error('TikTok API error', data);
      res.status(500).json({ error: 'Gagal mengambil data dari TikTok.' });
      return;
    }

    res.status(200).json({ downloadUrl: data.data.play });
  } catch (err) {
    console.error('Error in tiktok handler:', err);
    res.status(500).json({ error: 'Gagal memproses permintaan TikTok.' });
  }
}
