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
    addMessage("Hello " + window.userName + "! Login successful. How can I help you today?", 'ai');
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

// Request state control
let isSending = false;

// DIRECT GROQ API CONFIGURATION
const GROQ_API_KEY = "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
";

async function getAIResponse(prompt) {
    try {
        // Doğrudan Groq API adresine istek atıyoruz
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                        content: "You are Pilot AI. Developed by Wind Developers." 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'API Error');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Technical Error:", error);
        return "Connection error: " + error.message;
    }
}

// Send Function
async function handleSend() {
    const text = userInput.value.trim();
    
    // Prevention of empty messages and multiple simultaneous requests
    if (!text || isSending) return;

    isSending = true;
    sendBtn.disabled = true;

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

    isSending = false;
    sendBtn.disabled = false;
}

function addMessage(text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'user-msg' : 'ai-msg';
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Event Listeners
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') handleSend(); 
});
