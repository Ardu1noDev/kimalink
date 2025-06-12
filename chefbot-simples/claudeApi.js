const Anthropic = require('@anthropic-ai/sdk');

// Acessa sua chave de API do .env
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function getClaudeReply(message) {
    try {
        // Escolha o modelo que deseja usar. claude-3-haiku-20240307 é mais rápido e econômico,
        // claude-3-sonnet-20240229 é um bom equilíbrio, e claude-3-opus-20240229 é o mais poderoso.
        const modelName = "claude-3-haiku-20240307"; // Ou "claude-3-sonnet-20240229", "claude-3-opus-20240229"

        const response = await anthropic.messages.create({
            model: modelName,
            max_tokens: 150, // Limite de tokens para a resposta
            messages: [
                { role: "user", content: message }
            ],
            // Optional: System prompt for role-playing, similar to OpenAI
            // system: "Você é o ChefBot, um assistente culinário útil. Forneça receitas, dicas de cozinha e informações sobre ingredientes. Mantenha as respostas concisas e amigáveis."
        });

        // A resposta do Claude 3 (messages API) está em response.content[0].text
        // response.content é um array de "blocos" de conteúdo.
        return response.content[0].text;

    } catch (error) {
        console.error('Erro ao comunicar com a API da Anthropic Claude:', error);

        // A estrutura de erro da Anthropic pode variar, tente logar o máximo de detalhes
        if (error.status) { // Para erros HTTP (ex: 401 Unauthorized, 429 Rate Limit)
            console.error('Status da API:', error.status);
            console.error('Tipo de erro:', error.error.type); // 'authentication_error', 'rate_limit_error', etc.
            console.error('Detalhes do erro:', error.message);
        } else { // Para outros tipos de erros
            console.error('Erro inesperado:', error);
        }

        // Lança um erro mais amigável para o cliente
        throw new Error('Não foi possível obter uma resposta do ChefBot. Verifique sua chave de API ou o status do serviço.');
    }
}

module.exports = {
    getClaudeReply,
};