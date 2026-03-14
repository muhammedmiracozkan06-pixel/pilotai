<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pilot AI - Wind Developers</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
    <div id="login-overlay">
        <div class="login-box">
            <h1>Pilot AI</h1>
            <p>Please login with Google to continue</p>
            <div id="buttonDiv"></div>
        </div>
    </div>

    <div class="app-container">
        <header>
            <div class="logo">Pilot AI</div>
            <div id="user-info" style="display: none;">
                <span id="user-name"></span>
                <img id="user-pic" src="" alt="Profile">
            </div>
            <select id="model-select">
                <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
                <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
            </select>
        </header>

        <div id="chat-window"></div>

        <div class="input-area">
            <input type="text" id="user-input" placeholder="Type a message...">
            <button id="send-btn">Send</button>
        </div>
    </div>

    <script>
        window.onload = function () {
            google.accounts.id.initialize({
                client_id: "64726463498-valtvmnoh0l88qsud6188dmpn54j5sqf.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large" }
            );
        }
    </script>
    <script src="script.js"></script>
</body>
</html>
