/**
 * Catálogo central para todas as mensagens personalizáveis do bot.
 */

// --- MENSAGENS DE BOAS-VINDAS E SAÍDA ---
module.exports.welcomeMessage = "Seja bem vindo ao nosso grupo, @member!";
module.exports.exitMessage = "Poxa, @member saiu do grupo... Sentiremos sua falta!";


// --- MENSAGENS DE ESPERA (POR CATEGORIA) ---
const waitingMessages = {
    default: [
        "⏳ Um momento, estou preparando tudo...",
        "⏳ Processando...",
        "⏳ Aguarde, já estou trabalhando nisso...",
    ],
    downloads: [
        "📥 Baixando mídia...",
        "📥 Processando o seu pedido, um momento...",
        "📥 Preparando o seu download...",
        "📥 Aguarde! Estou enviando sua mídia...",
    ],
    stickers: [
        "Tô indo...",
        "Chamou princesa?",
        "🦍...Espera aí, putinha",
        "Aguarde...",
        "🦍...Seu mordomo, às suas ordens amor",
        "Peraí betinha...",
        "Ok!",
        "Em 3,2,1...",
        "Saindo!",
        "Eu quero gozar...",
        "Calma a bunda aí...",
        "Já vai!",
        "🧵",
        "⏳",
        
    ],
    searches: [
        "🔎 Processando...",
        "🔎 Vasculhando a internet...",
        "🔎 Organizando os resultados da busca...",
    ]
};

// Esta função sorteia uma das mensagens da categoria especificada
module.exports.getRandomWaitMessage = (category = 'default') => {
    const messages = waitingMessages[category] || waitingMessages.default;
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
};
