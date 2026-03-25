// Wind Developers - Pilot AI 🚀

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');

let isSending = false;

// API KEYS
const GROQ_API_KEY = "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";
const GEMINI_API_KEY = "AIzaSyCdrlj-9KaeqK7ww0OsxM0Nkgk4hkpE5Ek";

async function getAIResponse(prompt) {
    const selectedModel = modelSelect.value;
    
    try {
        // Eğer seçilen model Gemini ise (HTML'de value "gemini-1.5-flash" gibi olmalı)
        if (selectedModel.includes("gemini")) {
            // URL'yi v1 olarak güncelledik ve model yapısını düzelttik
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Sen pilot ai sin. seni wind developers geliştirdi. Biri sana kim olduğunu sorarsa wind developers tarafından geliştirilen bir yapay zekayım diyeceksin. İsmin Pilot AI. Soru: ${prompt}` }]
                    }]
                })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Gemini API Error');
            
            return data.candidates[0].content.parts[0].text;
        } 
        
        // Groq API Akışı
        else {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: selectedModel, 
                    messages: [
                        { role: "system", content: "Sen pilot ai sin. seni wind developers geliştirdi biri sana sen kimsin vb. sorarsa wind developer tarafından geliştirilen bir yapay zekayım diyeceksin. İsmin Pilot AI." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Groq API Error');
            return data.choices[0].message.content;
        }
    } catch (error) {
        console.error("Technical Error:", error);
        return "Bağlantı Hatası: " + error.message;
    }
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text || isSending) return;

    isSending = true;
    sendBtn.disabled = true;

    addMessage(text, 'user-msg');
    userInput.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg';
    loadingDiv.innerText = "...";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    const response = await getAIResponse(text);
    loadingDiv.innerText = response;
    
    isSending = false;
    sendBtn.disabled = false;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') handleSend(); 
});
