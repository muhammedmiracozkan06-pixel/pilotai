// API AYARLARI
const GROQ_API_KEY = "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".trim(); 
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function getAIResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gemma2-9b-it", // En güncel ve hızlı model
                messages: [
                    { 
                        role: "system", 
                        content: "Sen Pilot AI'sın.  enerjik ve bol emoji kullanan bir asistansın. Kullanıcının istediği dilde kusursuz şekilde konuş. sen wind developers  tarafından geliştirildin türkçeyi kusursuz konuş cevabını göndermeden önce mesajını 3 kere kontrol et ve hataları düzelt kullanıcı ne isterse yap" 
                    },
                    { 
                        role: "user", 
                        content: prompt 
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Detaylı Hata:", data);
            return `Hata: ${data.error.message} (Kod: ${response.status})`;
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("network error:", error);
        return "network error error code 678";
    }
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // Kullanıcı mesajı
    addMessage(text, 'user');
    userInput.value = '';

    // Yükleniyor mesajı
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg';
    loadingDiv.innerText = "I am thinking...";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    const response = await getAIResponse(text);
    
    // Yükleniyor yazısını gerçek cevapla değiştir
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
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
