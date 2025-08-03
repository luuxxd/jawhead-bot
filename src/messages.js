// --- MENSAGENS DE BOAS-VINDAS E SAÍDA ---
module.exports.welcomeMessage = "Seja bem vindo ao nosso grupo, @member!";
module.exports.exitMessage = "@member saiu do grupo... Não vai fazer falta.";


// --- MENSAGENS DE ESPERA (NOVAS) ---
const waitingMessages = [
    "⏳ Um momento, estou preparando tudo...",
    "⏳ Quase lá! Buscando seu arquivo...",
    "⏳ Só um instante, já estou enviando...",
    "⏳ Carregando... por favor, aguarde um pouco.",
    "⏳ Enviando seu pedido, aguarde..."
];

// Esta função sorteia uma das mensagens da lista acima
module.exports.getRandomWaitMessage = () => {
    const index = Math.floor(Math.random() * waitingMessages.length);
    return waitingMessages[index];
};
