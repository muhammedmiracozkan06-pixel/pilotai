export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST kabul edilir' });
    }

    const { prompt, model, userName } = req.body;
    const apiKey = process.env.groqapikey; 

    if (!apiKey) {
        return res.status(500).json({ error: "Vercel'de 'groqapikey' bulunamadı kanka!" });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || "llama-3.1-8b-instant", // Model seçilmemişse yedek model
                messages: [
                    { role: "system", content: `Sen Pilot AI'sın. Geliştiricin Wind Developers. Kullanıcı: ${userName}` },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
}
