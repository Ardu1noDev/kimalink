// chefbot/chefbot-core.js

document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendMessageButton = document.getElementById("sendMessageButton");
    const chatCloseButton = document.getElementById("chatCloseButton");

    // Função para adicionar mensagem ao chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll para a última mensagem
    }

    // Função para mostrar/esconder dots de carregamento
    function toggleLoadingDots(show) {
        let loadingDiv = document.getElementById("loadingDots");
        if (show) {
            if (!loadingDiv) {
                loadingDiv = document.createElement("div");
                loadingDiv.id = "loadingDots";
                loadingDiv.classList.add("message", "bot", "loading-dots");
                loadingDiv.innerHTML = '<span></span><span></span><span></span>';
                chatMessages.appendChild(loadingDiv);
            }
        } else {
            if (loadingDiv) {
                loadingDiv.remove();
            }
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Função para enviar mensagem para o servidor Node.js
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message === "") return;

        addMessage(message, "user");
        chatInput.value = "";
        toggleLoadingDots(true); // Mostra os dots de carregamento

        try {
            // A requisição agora aponta para o seu servidor local na porta 3000
            // O servidor Node.js é quem fará a requisição para a API da OpenAI/Anthropic
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const data = await response.json();
            addMessage(data.reply, "bot"); // A resposta do servidor é 'reply'
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            addMessage("Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.", "bot");
        } finally {
            toggleLoadingDots(false); // Esconde os dots de carregamento
        }
    }

    // Event listeners
    sendMessageButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Event listener para o botão de fechar (redireciona de volta para a página principal)
    chatCloseButton.addEventListener("click", () => {
        // Como o chatbot/index.html está dentro de uma pasta,
        // para voltar para o index.html na pasta raiz, usamos '../index.html'
        window.location.href = "../index.html";
    });

    // Mensagem de boas-vindas inicial do bot
    addMessage("Olá! Sou o ChefBot. Como posso ajudar com suas receitas hoje?", "bot");
});