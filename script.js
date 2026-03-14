// GOOGLE AUTH FONKSİYONLARI (Giriş yapınca ekranın kapanması için)
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    console.log("Giriş Başarılı: " + responsePayload.name);
    
    // Giriş ekranını gizle
    document.getElementById('login-overlay').style.display = 'none';
    
    // İstersen kullanıcının adını bir değişkene atabilirsin
    window.userName = responsePayload.given_name;
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// API AYARLARI
const GROQ_API_KEY = "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"; // Kendi key'ini buraya koy kanka
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select'); // Seçim kutusunu tanımladık

async function getAIResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelSelect.value, 
                messages: [
                    { 
                        role: "system", 
                        content: "Sen Pilot AI'sın. Dilleri düzgün konuş sen wind developers tarafından geliştirildin." 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        return "Network error!";
    }
}

// Gönderme Fonksiyonu
async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg';
    loadingDiv.innerText = "...";
    chatWindow.appendChild(loadingDiv);
    
    const response = await getAIResponse(text);
    loadingDiv.innerText = response;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'user-msg' : 'ai-msg';
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
