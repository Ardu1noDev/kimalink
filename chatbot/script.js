// Seletores de elementos
const chatInput = document.getElementById('chat-input');
const chatSendButton = document.getElementById('chat-send-button');
const chatMessages = document.getElementById('chat-messages');
const chatCloseButton = document.getElementById('chatCloseButton');
const typingIndicator = document.getElementById('typing-indicator');

// Função para adicionar mensagem ao chat
function addMessage(sender, message) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('flex', 'items-start', 'mb-2');

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('p-3', 'rounded-lg', 'max-w-[80%]');

    if (sender === 'user') {
        messageWrapper.classList.add('justify-end');
        messageBubble.classList.add('bg-green-600', 'text-white', 'user-message-bubble');
        messageBubble.textContent = message;
    } else { // sender === 'bot'
        messageWrapper.classList.add('justify-start');
        messageBubble.classList.add('bg-gray-200', 'text-gray-800', 'bot-message-bubble');

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-robot', 'text-green-600', 'text-2xl', 'mr-3', 'mt-1', 'flex-shrink-0');
        messageWrapper.appendChild(icon);

        messageBubble.textContent = message;
    }

    messageWrapper.appendChild(messageBubble);
    chatMessages.appendChild(messageWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para enviar mensagem
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    addMessage('user', message);
    chatInput.value = '';

    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // ESSA É A LINHA CRÍTICA PARA A COMUNICAÇÃO COM O SEU BACKEND
        const response = await fetch('/api/chat', { // Aponta para a rota no server.js
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();
        addMessage('bot', data.reply);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        addMessage('bot', 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
    } finally {
        typingIndicator.classList.add('hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Event listeners
chatSendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Event listener para o botão de fechar (redireciona para o index.html na PASTA ACIMA)
chatCloseButton.addEventListener("click", () => {
    window.location.href = "../index.html"; // Volta para a página principal
});