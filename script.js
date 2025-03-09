const programmedResponses = {
    "créateur": "Mon créateur est Messie Osango.",
    "qui es-tu": "Je suis Messie Chatbot.",
    "qui t'a créé": "Je suis conçu par Messie Osango.",
    "qui es-tu ?": "Je suis l'intelligence artificielle conçue par Messie Osango.",
    "qui t'a créé ?": "Messie Osango est mon créateur !",
    "qui est messie osango": "Messie Osango est mon créateur et développeur.",
"quelle année sommes-nous ?":"nous sommes en 2025",
};

async function sendMessage() {
    let userInput = document.getElementById("userInput").value.trim().toLowerCase();
    if (!userInput) return;

    appendMessage("user", userInput);
    document.getElementById("userInput").value = "";

    if (programmedResponses[userInput]) {
        appendMessage("bot", programmedResponses[userInput]);
        saveQuestionAndResponse(userInput, programmedResponses[userInput]);
        return;
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: userInput }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const botReply = data.choices[0].message.content;
        appendMessage("bot", botReply);
        saveQuestionAndResponse(userInput, botReply);
    } catch (error) {
        appendMessage("bot", "⚠️ Erreur de connexion à l'API !");
    }
}

function appendMessage(sender, message) {
    let chatbox = document.getElementById("chatbox");
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    
    if (sender === "bot") {
        chatbox.appendChild(msgDiv);
        typeMessage(msgDiv, message);
    } else {
        msgDiv.innerText = message;
        chatbox.appendChild(msgDiv);
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}

function typeMessage(element, message) {
    let i = 0;
    function type() {
        if (i < message.length) {
            element.innerHTML += message.charAt(i);
            i++;
            setTimeout(type, 5);
        }
    }
    type();
}

function saveQuestionAndResponse(question, response) {
    let savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    savedData.push({ question, response });
    localStorage.setItem("savedData", JSON.stringify(savedData));
}

function showSavedQuestions() {
    let savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    
    if (savedData.length === 0) {
        Swal.fire({ title: "📂 Aucune question enregistrée", text: "Aucune question n'est enregistrée.", background: "#0d0d1a", color: "#0ff", confirmButtonText: "Fermer", confirmButtonColor: "#ff007f" });
        return;
    }

    let buttonsHtml = savedData.map((entry, index) => `<button id="questionBtn${index}" class="saved-question-btn" style="background:  #8000ff; padding: 10px; margin:10px;">${entry.question.substring(0, 30)}...</button><br>`).join("");

    Swal.fire({ title: "📂 Questions enregistrées", html: `<div>${buttonsHtml}</div>`, background: "#0d0d1a", color: "#0ff", showConfirmButton: false });

    savedData.forEach((entry, index) => {
        document.getElementById(`questionBtn${index}`).addEventListener('click', () => showResponse(entry.question, entry.response));
    });
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}
