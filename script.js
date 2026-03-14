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
    addMessage("Hello " + window.userName + "! Login successful. How can I help you today? ✨", 'ai');
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

// SECURE API CALL (Serverless)
async function getAIResponse(prompt) {
    try {
        // Artik direkt Groq'a degil, kendi gizli '/api/chat' yolumuza gidiyoruz!
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelSelect.value, 
                prompt: prompt,
                userName: window.userName || "User"
            })
        });

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error:", error);
        return "Network error! Please check your connection.";
    }
}

// Send Function
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
