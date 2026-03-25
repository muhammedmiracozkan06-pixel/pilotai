// Wind Developers - Pilot AI 🚀

var chatWindow = document.getElementById('chat-window');
var userInput = document.getElementById('user-input');
var sendBtn = document.getElementById('send-btn');
var modelSelect = document.getElementById('model-select');

var isSending = false;

// API KEYS
var GROQ_API_KEY = "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";
var GEMINI_API_KEY = "AIzaSyCdrlj-9KaeqK7ww0OsxM0Nkgk4hkpE5Ek";

async function getAIResponse(prompt) {
    var selectedModel = modelSelect.value;
    
    try {
        if (selectedModel.indexOf("gemini") !== -1) {
            // URL yapisini en ilkel sekilde birlestirdik
            var url = "https://generativelanguage.googleapis.com/v1beta/models/" + selectedModel + ":generateContent?key=" + GEMINI_API_KEY;
            
            var response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: "Sen Pilot AI sistemisin. Wind Developers tarafindan gelistirildin. Soru: " + prompt }]
                    }]
                })
            });
            
            var data = await response.json();
            if (!response.ok) throw new Error(data.error ? data.error.message : "API Hatasi");
            
            return data.candidates[0].content.parts[0].text;
        } 
        else {
            var response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
            
            var data = await response.json();
            if (!response.ok) throw new Error(data.error ? data.error.message : "API Hatasi");
            return data.choices[0].message.content;
        }
    } catch (error) {
        console.error("Teknik Hata:", error);
        return "Baglanti Hatasi: " + error.message;
    }
}

async function handleSend() {
    var text = userInput.value.trim();
    if (!text || isSending) return;

    isSending = true;
    sendBtn.disabled = true;

    addMessage(text, 'user-msg');
    userInput.value = '';

    var loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg';
    loadingDiv.innerText = "...";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    var response = await getAIResponse(text);
    loadingDiv.innerText = response;
    
    isSending = false;
    sendBtn.disabled = false;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(text, className) {
    var msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Butonlari bagla
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', function(e) { 
    if (e.key === 'Enter') handleSend(); 
});
