const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Importa a biblioteca para fazer requisições HTTP

// --- Carregamento das Variáveis de Ambiente ---
// É CRÍTICO que esta linha seja uma das primeiras!
// Ela carrega as chaves (como HUGGINGFACE_API_KEY) do arquivo .env
// que está dentro da pasta 'chatbot'.
require('dotenv').config({ path: path.resolve(__dirname, 'chatbot', '.env') });

const app = express();
const port = process.env.PORT || 3000; // Define a porta do servidor, padrão 3000

// --- Middlewares Essenciais ---
// Habilita o Express a parsear o corpo das requisições como JSON.
// Isso é necessário para receber a mensagem do usuário do frontend.
app.use(express.json());

// --- Servindo Arquivos Estáticos ---
// 1. Serve arquivos da raiz do projeto (Ex: index.html principal, qualquer CSS/JS na raiz).
// Se seu 'chefbot-core.js' ou 'spoofer.js' estiverem na raiz, esta linha os serve.
// Se você não precisa deles, remova as tags <script> que os referenciam do seu HTML.
app.use(express.static(path.join(__dirname)));

// 2. Serve arquivos estáticos da pasta 'chatbot' sob o caminho '/chatbot'.
// Ex: http://localhost:3000/chatbot/index.html, http://localhost:3000/chatbot/script.js
app.use('/chatbot', express.static(path.join(__dirname, 'chatbot')));

// --- Rotas da Aplicação ---

// Rota principal para a página inicial (tela de produtos, por exemplo).
// Quando alguém acessa http://localhost:3000/, ele envia o index.html da raiz.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota da API para o Chatbot (o ponto de comunicação entre frontend e backend).
// Esta rota espera requisições POST do seu 'chatbot/script.js' para '/api/chat'.
app.post('/api/chat', async (req, res) => {
    // Extrai a mensagem do usuário do corpo da requisição JSON.
    const userMessage = req.body.message;
    console.log("Mensagem recebida do frontend:", userMessage);

    // Obtém a chave da API da Hugging Face das variáveis de ambiente.
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;

    // Verifica se a chave da API está configurada.
    if (!hfApiKey) {
        console.error("ERRO: Chave da API Hugging Face (HUGGINGFACE_API_KEY) não configurada no arquivo .env.");
        return res.status(500).json({ error: "Chave da API Hugging Face não configurada no servidor." });
    }

    // Define o ID do modelo da Hugging Face a ser usado.
    // Você pode trocar este modelo, mas verifique sua documentação na Hugging Face.
    // 'facebook/blenderbot-400M-distill' é um bom ponto de partida para conversação.
    const modelId = "facebook/blenderbot-400M-distill";

    try {
        // Faz a requisição para a API de Inferência da Hugging Face.
        const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
            headers: {
                Authorization: `Bearer ${hfApiKey}`, // Sua chave vai aqui
                'Content-Type': 'application/json' // Informa que o corpo é JSON
            },
            method: "POST", // Método POST para enviar dados
            // O corpo da requisição, conforme esperado pela API da Hugging Face para muitos modelos.
            body: JSON.stringify({ inputs: userMessage }),
        });

        // Tenta parsear a resposta da API como JSON.
        const result = await response.json();

        // Verifica se a requisição HTTP foi bem-sucedida (status 200 OK).
        if (response.ok) {
            let botReply = "Desculpe, não consegui obter uma resposta do ChefBot.";

            // Adapta a extração da resposta com base no formato comum de modelos de conversação.
            if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
                botReply = result[0].generated_text;
            } else if (result.generated_text) { // Alguns modelos podem retornar direto o objeto
                botReply = result.generated_text;
            } else if (result.error) { // A API da Hugging Face pode retornar erros em JSON
                console.error("Erro específico da API Hugging Face:", result.error);
                botReply = `Erro da API Hugging Face: ${result.error}`;
            } else { // Caso o formato da resposta seja inesperado
                console.warn("AVISO: Formato de resposta inesperado da Hugging Face:", result);
                botReply = "Recebi uma resposta, mas não consegui interpretá-la. Tente novamente.";
            }
            // Envia a resposta do bot de volta para o frontend.
            res.json({ reply: botReply });
        } else {
            // Se a requisição HTTP não foi bem-sucedida (ex: 401 Unauthorized, 400 Bad Request, 500 Internal Server Error).
            console.error("Erro HTTP da API Hugging Face:", response.status, result);
            res.status(response.status).json({
                error: `Erro ao comunicar com a API Hugging Face. Status: ${response.status}. Mensagem: ${result.error || JSON.stringify(result)}`
            });
        }

    } catch (error) {
        // Captura erros de rede, problemas com a requisição fetch, etc.
        console.error('Erro GERAL ao chamar a API Hugging Face (problema de rede/código):', error);
        res.status(500).json({ error: 'Erro interno ao comunicar com a API Hugging Face. Por favor, verifique os logs do servidor.' });
    }
});

// --- Captura de Rotas Não Encontradas (404) ---
// Este middleware é executado se nenhuma das rotas acima corresponder à requisição.
// DEVE SER O ÚLTIMO MIDDLEWARE DEFINIDO.
app.use((req, res, next) => {
    console.warn(`404 - Rota não encontrada: ${req.url}`);
    res.status(404).send(`404 - Not Found: ${req.url}`);
});

// --- Início do Servidor ---
// O servidor começa a "escutar" requisições na porta definida.
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});