export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ reply: 'Method not allowed' });
      return;
    }
    const body = req.body || await req.json?.();
    const prompt = body?.prompt || '';
    if (!prompt) {
      res.status(400).json({ reply: 'Prompt tidak boleh kosong.' });
      return;
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      res.status(500).json({ reply: 'GEMINI_API_KEY tidak ditemukan. Set environment variable di Vercel.' });
      return;
    }

    const reqBody = {
      "prompt": {
        "text": prompt
      },
      "temperature": 0.2,
      "maxOutputTokens": 512
    };

    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateText?key=" + GEMINI_API_KEY;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    });

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.output?.[0]?.content?.text ||
      data?.text ||
      JSON.stringify(data);

    res.status(200).json({ reply: String(reply) });
  } catch (err) {
    console.error('Error contacting Gemini:', err);
    res.status(500).json({ reply: 'Terjadi kesalahan saat menghubungi Gemini API.' });
  }
}
