// Wind Developers - Pilot AI 🚀

// GOOGLE AUTH OPERATIONS
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    
    // 1. Remove login overlay
    const overlay = document.getElementById('login-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 500);

    // 2. Add profile info to header
    document.getElementById('user-name').innerText = responsePayload.given_name;
    document.getElementById('user-pic').src = responsePayload.picture;
    document.getElementById('user-info').style.display = 'flex';

    window.userName = responsePayload.given_name;

    // 3. Add initial welcome message
    addMessage("Merhaba " + window.userName + "! Giriş başarılı. Sana nasıl yardımcı olabilirim bugün? ✨", 'ai');
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// UI ELEMENTS
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');

// Kilit Değişkeni (Çift tıklamayı engeller)
let isSending = false;

// SECURE API CALL (Serverless)
async function getAIResponse(prompt) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelSelect.value, 
                prompt: prompt,
                userName: window.userName || "Mirac"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Backend'den gelen detaylı hatayı fırlat
            throw new Error(data.error || 'API error');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Hata Detayı:", error);
        return "Bağlantı hatası kankiş! Lütfen internetini veya Vercel ayarlarını kontrol et. Hata: " + error.message;
    }
}

// Send Function
async function handleSend() {
    const text = userInput.value.trim();
    
    // Boş mesajı veya işlem devam ederken basılmasını engelle
    if (!text || isSending) return;

    isSending = true; // Kilidi kapat
    sendBtn.disabled = true; // Butonu dondur

    addMessage(text, 'user');
    userInput.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg';
    loadingDiv.innerText = "...";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    const response = await getAIResponse(text);
    
    loadingDiv.innerText = response;
    chatWindow.scrollTop = chatWindow.scrollHeight;

    isSending = false; // Kilidi aç
    sendBtn.disabled = false; // Butonu aktif et
}

function addMessage(text, role) {
    const msgDiv = document.createElement('div');
    // Senin CSS sınıflarına göre ayarlandı
    msgDiv.className = role === 'user' ? 'user-msg' : 'ai-msg';
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Olay Dinleyiciler
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') handleSend(); 
});
