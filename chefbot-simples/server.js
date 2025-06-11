require('dotenv').config(); // Carrega as variáveis de ambiente do .env
const express = require('express');
const path = require('path');
const { getChatGPTReply } = require('./chatgpt'); // Importa a função do chatgpt.js

const app = express();
const port = process.env.PORT || 3000; // Porta do servidor

// Middleware para servir arquivos estáticos (seu index.html)
app.use(express.static(path.join(__dirname)));

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rota para a comunicação com o ChefBot
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Mensagem vazia.' });
    }

    console.log(`Mensagem do usuário recebida: "${userMessage}"`);

    try {
        const chatGPTReply = await getChatGPTReply(userMessage);
        console.log(`Resposta do ChefBot: "${chatGPTReply}"`);
        res.json({ reply: chatGPTReply });
    } catch (error) {
        console.error('Erro ao obter resposta do ChatGPT:', error);
        res.status(500).json({ error: 'Erro ao processar a mensagem do ChefBot.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor ChefBot rodando em http://localhost:${port}`);
    console.log('Abra seu navegador e acesse esta URL.');
});