// API AYARLARI
const GROQ_API_KEY = "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"; 
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Mesaj Ekleme Fonksiyonu
function addMessage(text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'user-msg' : 'ai-msg';
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// AI'dan Yanıt Alma
async function getAIResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "system", content: "Sen Pilot AI'sın. Arkadaş canlısı bir yardımcısın." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        return "Connection error! Check your connection! error code 678";
    }
}

// Gönderme İşlemi
async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    const loadingMsg = "I am thinking...";
    addMessage(loadingMsg, 'ai');
    
    const response = await getAIResponse(text);
    
    // "Düşünüyorum" yazısını sil ve gerçek cevabı yaz
    chatWindow.lastChild.innerText = response;
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
