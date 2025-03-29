      const API_KEY = "AIzaSyBQeZVi4QdrnGKPEfXXx1tdIqlMM8iqvZw";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const programmedResponses = {
            "créateur": "Mon créateur est Messie Osango.",
            "qui es-tu": "Je suis Messie Chatbot.",
            "qui t'a créé": "Je suis conçu par Messie Osango.",
            "qui es-tu ?": "Je suis l'intelligence artificielle conçue par Messie Osango.",
            "qui t'a créé ?": "Messie Osango est mon créateur !",
            "qui est messie osango": "Messie Osango est mon créateur et développeur.",
        };

        async function sendMessage() {
            let userInput = document.getElementById("userInput").value.trim();
            if (!userInput) return;

            appendMessage("user", userInput);
            document.getElementById("userInput").value = "";

            if (programmedResponses[userInput.toLowerCase()]) {
                appendMessage("bot", programmedResponses[userInput.toLowerCase()]);
                saveQuestionAndResponse(userInput, programmedResponses[userInput.toLowerCase()]);
                return;
            }

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: userInput }] }] })
                });

                const data = await response.json();
                const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas compris.";
                appendMessage("bot", botReply);
                saveQuestionAndResponse(userInput, botReply);
            } catch (error) {
                appendMessage("bot", "⚠️ Erreur de connexion !");
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
                msgDiv.textContent = message;
                chatbox.appendChild(msgDiv);
            }

            chatbox.scrollTop = chatbox.scrollHeight;
        }

        function typeMessage(element, message) {
            let i = 0;
            function type() {
                if (i < message.length) {
                    element.textContent += message.charAt(i);
                    i++;
                    setTimeout(type, 20);
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
                Swal.fire("📂 Aucune question enregistrée", "Il n'y a pas encore de questions enregistrées.", "info");
                return;
            }

            let buttonsHtml = savedData.map((entry, index) => 
     `<button id="questionBtn${index}" class="saved-question" onclick="showResponse(${index})">${entry.question}</button>`
            ).join("");

            Swal.fire({
                title: "QUESTION",
                html: `<div id="savedQuestionsContainer">${buttonsHtml}</div>`,
                showConfirmButton: false,
                showCloseButton: true,
                customClass: {
                    popup: 'black-popup',
                    title: 'white-title',
                    htmlContainer: 'white-text'
                }
            });
        }

        function showResponse(index) {
            let savedData = JSON.parse(localStorage.getItem("savedData")) || [];
            let selectedData = savedData[index];
            Swal.fire({
                title: "QUESTION",
                html: `<div class="response-container"><b>Question:</b> ${selectedData.question}<br><br><br>
                <b>Réponse:</b><br>
                <br> ${selectedData.response}</div>`,
                showConfirmButton: true,
                confirmButtonText: "Fermer",
                customClass: {
                    popup: 'black-popup',
                    title: 'white-title',
                    htmlContainer: 'white-text'
                }
            });
        }

        function handleKeyPress(event) {
            if (event.key === "Enter") {
                sendMessage();
            }
                   }
