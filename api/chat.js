export default async function handler(req, res) {
    // Güvenlik: Sadece POST isteklerini kabul et
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt, model, userName } = req.body;
    
    // Senin Vercel'e verdiğin isimle anahtarı çağırıyoruz
    const apiKey = process.env.groqapikey; 

    if (!apiKey) {
        return res.status(500).json({ error: "API Key bulunamadı! Vercel ayarlarını kontrol et kanka." });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model, // Arayüzden seçtiğin model buraya geliyor
                messages: [
                    { 
                        role: "system", 
                        content: `You are Pilot AI. Developed by Wind Developers. Friendly and helpful. User name: ${userName || "User"}` 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Backend hatası:", error);
        res.status(500).json({ error: "Groq ile bağlantı kurulamadı." });
    }
}
