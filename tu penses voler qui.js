       // Définition des réponses programmées
        const programmedResponses = {
            "créateur": "Mon créateur est Messie Osango.",
            "qui es-tu": "Je suis Messie Chatbot.",
            "qui t'a créé": "Je suis conçu par Messie Osango.",
            "qui es-tu ?":"je suis l'intelligence artificielle conçue par messie osango",
            "qui t'a créé ?":"messie osango est mon créateur !",
            "qui est messie osango":"messie osango est mon créateur et développeur ",
            
        };

        async function sendMessage() {
            let userInput = document.getElementById("userInput").value.trim().toLowerCase();
            if (!userInput) return;

            appendMessage("user", userInput);
            document.getElementById("userInput").value = "";

            // Vérification des réponses programmées
            if (programmedResponses[userInput]) {
                appendMessage("bot", programmedResponses[userInput]);
                saveQuestionAndResponse(userInput, programmedResponses[userInput]);
                return;
            }

            // Si aucune réponse programmée n'est trouvée, appel de l'API
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
                typeMessage(msgDiv, message); // Effet de frappe progressive pour le bot
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
                    setTimeout(type, 5); // Vitesse de frappe (30ms par lettre)
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
                Swal.fire({
                    title: "📂 Aucune question enregistrée",
                    text: "Il n'y a pas encore de questions enregistrées.",
                    background: "#0d0d1a",
                    color: "#0ff",
                    confirmButtonText: "Fermer",
                    confirmButtonColor: "#ff007f"
                });
                return;
            }

            let buttonsHtml = savedData.map((entry, index) => 
                `<button id="questionBtn${index}" class="saved-question-btn" 
                    style="background:  #8000ff; max-height: 300px; overflow-y: auto; text-align: left; padding: 10px;margin:10px;">
                    ${entry.question.substring(0, 30)}${entry.question.length > 30 ? '...' : ''}
                </button><br>`
            ).join("");

            Swal.fire({
                title: "📂 Questions enregistrées",
                html: `<div style="max-height: 60vh; overflow-y: auto;">${buttonsHtml}</div>`,
                background: "#0d0d1a",
                color: "#0ff",
                showConfirmButton: false,
                width: '700px'
            });

            savedData.forEach((entry, index) => {
                document.getElementById(`questionBtn${index}`).addEventListener('click', function() {
                    showResponse(entry.question, entry.response);
                });
            });
        }

        function showResponse(question, response) {
            Swal.fire({
                title: question,
                html: `<div style="
                    max-height: 60vh;
                    overflow-y: auto; 
                    text-align: left; 
                    padding: 10px;
                    white-space: pre-wrap;
                    font-family: monospace;
                    background: #1a1a2e;
                    border-radius: 5px;
                    border: 1px solid var(--neon-cyan);
                ">${response}</div>`,
                background: "#0d0d1a",
                color: "#0ff",
                confirmButtonText: "Fermer",
                confirmButtonColor: "#ff007f",
                width: '300px'
            });
        }

        function handleKeyPress(event) {
            if (event.key === "Enter") {
                sendMessage();
            }
                }
