export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: 'Masukkan URL TikTok' });

    const apiUrl = 'https://tikwm.com/api/?url=' + encodeURIComponent(url);
    const resp = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const text = await resp.text();
    try {
      const data = JSON.parse(text);
      if (data.code !== 0) throw new Error('Invalid response');
      return res.status(200).json({ downloadUrl: data.data.play });
    } catch (err) {
      console.error('Parse error:', text.substring(0, 100));
      return res.status(500).json({ error: 'Server TikTok tidak merespon JSON valid.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gagal mengunduh video TikTok.' });
  }
}
