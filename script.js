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
        // --- GEMINI MODELLERİ İÇİN AKIŞ (Pilot 7 Beta) ---
        if (selectedModel.includes("gemini")) {
            // HATA ÇÖZÜMÜ: URL'nin içine "models/" ekledik
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${GEMINI_API_KEY}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Sen Pilot AI'sın. Seni Wind Developers geliştirdi. Birisi sana kim olduğunu sorarsa "Wind Developers tarafından geliştirilen bir yapay zekayım" diyeceksin. Soru: ${prompt}` }]
                    }]
                })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Gemini API Hatası');
            
            return data.candidates[0].content.parts[0].text;
        } 
        
        // --- GROQ MODELLERİ İÇİN AKIŞ (Diğerleri) ---
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
                        { role: "system", content: "Sen Pilot AI'sın. Seni Wind Developers geliştirdi. Wind Developers tarafından geliştirilen bir yapay zekayım diyeceksin." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Groq API Hatası');
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

// Event Listeners
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') handleSend(); 
});
