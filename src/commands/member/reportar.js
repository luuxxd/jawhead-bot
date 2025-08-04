const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const settings = require(`${BASE_DIR}/settings.json`);

module.exports = {
  name: "reportar",
  description: "Reporta um bug ou problema para o dono do bot.",
  commands: ["reportar", "bug"],
  usage: `.reportar [descrição do problema]`,

  handle: async ({ 
    fullArgs, 
    sendReply, 
    webMessage, 
    socket,
    isGroup // A "fábrica" já nos diz se é um grupo ou não
  }) => {
    const reportMessage = fullArgs;
    const ownerJid = `${settings.owner.numbers[0]}@s.whatsapp.net`;

    // Pega o JID do usuário, funcionando em qualquer contexto
    const userJid = webMessage.key.participant || webMessage.key.remoteJid;

    if (!reportMessage) {
      throw new InvalidParameterError("Você precisa descrever o problema que quer reportar.");
    }
    if (!ownerJid || !settings.owner.numbers.length) {
        return sendReply("❌ O dono do bot não está configurado. Não posso enviar o relatório.");
    }

    let reportHeader = `*❗ NOVO REPORTE DE BUG ❗*\n\n` +
                         `*De:* ${webMessage.pushName} (@${userJid.split('@')[0]})\n`;

    // Adiciona o nome do grupo apenas se o comando for usado em um
    if (isGroup) {
        const groupMetadata = await socket.groupMetadata(webMessage.key.remoteJid);
        reportHeader += `*Grupo:* ${groupMetadata.subject}\n`;
    } else {
        reportHeader += `*Origem:* Chat Privado\n`;
    }

    const fullReport = `${reportHeader}\n*Mensagem:*\n${reportMessage}`;

    // Envia o relatório para o PV do dono
    await socket.sendMessage(ownerJid, { text: fullReport, mentions: [userJid] });

    await sendReply("✅ Seu relatório foi enviado com sucesso para o meu dono! Obrigado por ajudar a melhorar o bot.");
  },
};
