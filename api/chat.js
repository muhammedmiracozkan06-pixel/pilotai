export default async function handler(req, res) {
    // Sadece POST kabul et
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt, model, userName } = req.body;
    const apiKey = process.env.groqapikey; 

    // API Key kontrolü - Eğer yoksa hata mesajını detaylı döndürür
    if (!apiKey) {
        return res.status(500).json({ 
            error: "Vercel'de 'groqapikey' bulunamadı kanka! Ayarları kontrol et.",
            debug: "Environment variables missing" 
        });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `You are Pilot AI. Developed by Wind Developers. User: ${userName || "User"}` 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        // Eğer Groq tarafında bir hata varsa onu da yakalayalım
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası oluştu kanka!", details: error.message });
    }
}
