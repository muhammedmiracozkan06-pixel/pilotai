export default async function handler(req, res) {
    // Sadece POST isteklerine izin ver (Güvenlik için)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt, model, userName } = req.body;
    const apiKey = process.env.GROQ_API_KEY; // Vercel'deki gizli kasanızdan anahtarı alır

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
                        content: `You are Pilot AI. Your developer is Wind Developers. Be helpful, friendly, and speak clearly. The user's name is ${userName || "User"}.` 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // Groq'dan gelen cevabı direkt ön tarafa (script.js'e) gönderir
        res.status(200).json(data);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "API connection failed on server" });
    }
}
