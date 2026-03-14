// GOOGLE AUTH FONKSİYONLARI
function handleCredentialResponse(response) {
    // Google verisini çöz
    const responsePayload = decodeJwtResponse(response.credential);
    
    // 1. Siyah ekranı kaldır
    const overlay = document.getElementById('login-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 500); // Yumuşak geçişle kapat

    // 2. Sağ üstteki profil bilgilerini doldur ve göster
    const userInfo = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const userPicImg = document.getElementById('user-pic');

    userNameSpan.innerText = responsePayload.given_name; // Sadece ilk adın
    userPicImg.src = responsePayload.picture; // Profil fotoğrafın
    userInfo.style.display = 'flex'; // Görünür yap

    window.userName = responsePayload.given_name;
    console.log("Hoş geldin " + window.userName);
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// API AYARLARI (Geri kalan her şey aynı kalsın)
const GROQ_API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');

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
                        content: "Sen Pilot AI'sın. Karşındaki kişi " + (window.userName || "Mirac") + ". Dilleri düzgün konuş sen wind developers tarafından geliştirildin." 
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
