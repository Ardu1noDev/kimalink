document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Função para adicionar uma mensagem ao chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para o final
    }

    // Função de resposta do chatbot (muito simples, você pode expandir!)
    function getBotResponse(userMessage) {
        userMessage = userMessage.toLowerCase();
        if (userMessage.includes('olá') || userMessage.includes('oi')) {
            return 'Olá! Como posso ajudar você?';
        } else if (userMessage.includes('tudo bem')) {
            return 'Estou ótimo, obrigado! E você?';
        } else if (userMessage.includes('nome')) {
            return 'Eu sou um chatbot, não tenho um nome!';
        } else if (userMessage.includes('ajuda')) {
            return 'Claro! Diga-me o que você precisa.';
        } else if (userMessage.includes('tchau')) {
            return 'Até mais! Foi um prazer conversar com você.';
        } else {
            return 'Desculpe, não entendi. Pode reformular?';
        }
    }

    // Função para enviar mensagem
    function sendMessage() {
        const userText = userInput.value.trim();
        if (userText === '') return;

        addMessage(userText, 'user');
        userInput.value = '';

        // Simula uma resposta do bot após um pequeno atraso
        setTimeout(() => {
            const botResponse = getBotResponse(userText);
            addMessage(botResponse, 'bot');
        }, 500);
    }

    // Event listeners para enviar mensagem
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Mensagem inicial do bot
    addMessage('Olá! Eu sou seu chatbot amigável. Como posso ajudar?', 'bot');
});
