const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const settings = require(`${BASE_DIR}/settings.json`);

module.exports = {
  name: "reportar",
  description: "Reporta um bug ou problema para o dono do bot.",
  commands: ["reportar", "bug"],
  usage: `.reportar [descrição do problema]`,

  handle: async ({ fullArgs, sendReply, webMessage, socket }) => {
    const reportMessage = fullArgs;
    const ownerJid = `${settings.owner.numbers[0]}@s.whatsapp.net`;

    if (!reportMessage) {
      throw new InvalidParameterError("Você precisa descrever o problema que quer reportar.");
    }
    if (!ownerJid) {
        return sendReply("❌ O dono do bot não está configurado. Não posso enviar o relatório.");
    }

    const reportHeader = `*❗ NOVO REPORTE DE BUG ❗*\n\n` +
                         `*De:* ${webMessage.pushName} (@${webMessage.key.participant.split('@')[0]})\n` +
                         `*Grupo:* ${(await socket.groupMetadata(webMessage.key.remoteJid)).subject}\n\n` +
                         `*Mensagem:*`;

    const fullReport = `${reportHeader}\n${reportMessage}`;

    // Envia o relatório para o PV do dono
    await socket.sendMessage(ownerJid, { text: fullReport, mentions: [webMessage.key.participant] });

    await sendReply("✅ Seu relatório foi enviado com sucesso para o meu dono! Obrigado por ajudar a melhorar o bot.");
  },
};
