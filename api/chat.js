export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { prompt, model, userName } = req.body; // script.js'den gelen modeli alıyoruz
    const apiKey = process.env.GROQ_API_KEY;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model, // İşte burada artık sabit bir isim yok, senin seçtiğin model var! 🎯
                messages: [
                    { 
                        role: "system", 
                        content: `You are Pilot AI. Developed by Wind Developers. User: ${userName}` 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "API connection failed" });
    }
}
