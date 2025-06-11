const { OpenAI } = require('openai'); // Importa a classe OpenAI da biblioteca

// Inicializa a API do OpenAI com a chave de API do .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Acessa a chave da variável de ambiente
});

async function getChatGPTReply(message) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Ou "gpt-4" se tiver acesso
            messages: [
                {
                    role: "system",
                    content: "Você é o ChefBot, um assistente culinário útil. Forneça receitas, dicas de cozinha e informações sobre ingredientes. Mantenha as respostas concisas e amigáveis."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error('Erro na chamada da API do OpenAI:', error);

        // Se for erro da API com resposta
        if (error.response && error.response.status === 429) {
            const errorCode = error.response.data?.error?.code;

            if (errorCode === 'insufficient_quota') {
                return "⚠️ O ChefBot atingiu o limite de uso da API no momento. Tente novamente mais tarde.";
            }

            return "⚠️ O ChefBot está temporariamente indisponível devido a muitas requisições. Por favor, aguarde alguns instantes.";
        }

        // Outros erros da API
        if (error.response) {
            console.error('Status da API:', error.response.status);
            console.error('Dados da API:', error.response.data);
        }

        return "❌ Ocorreu um erro ao tentar se comunicar com o ChatGPT. Verifique sua conexão ou tente novamente mais tarde.";
    }
}

module.exports = {
    getChatGPTReply,
};
