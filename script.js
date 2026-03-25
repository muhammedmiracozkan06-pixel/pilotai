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
        if (selectedModel.indexOf("gemini") !== -1) {
            // URL'yi en güvenli şekilde birleştiriyoruz
            const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/";
            const fullUrl = baseUrl + selectedModel + ":generateContent?key=" + GEMINI_API_KEY;
            
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: "Sen Pilot AI sistemisin. Wind Developers tarafindan gelistirildin. Soru: " + prompt }]
                    }]
                })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Gemini Hatasi");
            
            return data.candidates[0].content.parts[0].text;
        } 
        else {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': "Bearer " + GROQ_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: selectedModel, 
                    messages: [
                        { role: "system", content: "Sen Pilot AI sistemisin. Wind Developers tarafindan gelistirildin." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Groq Hatasi");
            return data.choices[0].message.content;
        }
    } catch (error) {
        console.error("Technical Error:", error);
        return "Baglanti Hatasi: " + error.message;
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

// Buton baglantilari
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', function(e) { 
    if (e.key === 'Enter') handleSend(); 
});        
