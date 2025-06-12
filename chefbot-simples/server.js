require('dotenv').config(); // Garante que as variáveis do .env sejam carregadas

const express = require('express');
const path = require('path');
// Importa a nova função da API Claude
const { getClaudeReply } = require('./claudeApi'); // Certifique-se que o nome do arquivo está correto

const app = express();
const port = process.env.PORT || 3000;

// Serve arquivos estáticos (seu frontend)
app.use(express.static(path.join(__dirname)));
app.use(express.json()); // Para parsear o corpo das requisições JSON

// Rota para o seu chatbot
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message; // A pergunta do usuário
    if (!userMessage) {
        return res.status(400).json({ error: 'Mensagem vazia.' });
    }

    console.log(`Mensagem do usuário recebida: "${userMessage}"`);

    try {
        // Chama a API da Anthropic Claude para obter a resposta
        const aiReply = await getClaudeReply(userMessage);
        console.log(`Resposta do ChefBot (Claude): "${aiReply}"`);
        res.json({ reply: aiReply }); // Envia a resposta de volta ao frontend
    } catch (error) {
        console.error('Erro ao processar a mensagem no servidor:', error);
        // Envia um erro HTTP 500 para o cliente, com a mensagem amigável
        res.status(500).json({ error: error.message || 'Erro interno do servidor.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor ChefBot rodando em http://localhost:${port}`);
    console.log('Abra seu navegador e acesse esta URL.');
});