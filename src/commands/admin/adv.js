const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { addWarn, getWarns, clearWarns } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "advertir",
  description: "Sistema de advertências. Use 'ver' ou 'limpar' como sub-comandos.",
  commands: ["adv", "advertir"],
  usage: `.adv [@membro | responder] [ver | limpar | motivo]`,
  
  handle: async ({ webMessage, socket, remoteJid, args }) => {
    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const targetJid = contextInfo?.mentionedJid?.[0] || contextInfo?.participant;

    if (!targetJid) {
      throw new InvalidParameterError("Você precisa marcar um membro ou responder à mensagem de alguém.");
    }

    const subCommand = args[0];
    const targetName = `@${targetJid.split('@')[0]}`;

    switch (subCommand) {
      case 'ver': {
        const warns = getWarns(targetJid);
        if (warns.length === 0) {
          const replyText = `O usuário ${targetName} não possui nenhuma advertência.`;
          return socket.sendMessage(remoteJid, { text: replyText, mentions: [targetJid] });
        }
        let replyMessage = `📋 *Histórico de Advertências de ${targetName} (${warns.length}/3):*\n\n`;
        warns.forEach((warn, index) => {
          replyMessage += `*${index + 1}º Motivo:* ${warn.reason}\n`;
        });
        await socket.sendMessage(remoteJid, { text: replyMessage, mentions: [targetJid] });
        break;
      }

      case 'limpar': {
        const warns = getWarns(targetJid);
        if (warns.length === 0) {
            const replyText = `O usuário ${targetName} não possui advertências para limpar.`;
            return socket.sendMessage(remoteJid, { text: replyText, mentions: [targetJid] });
        }
        clearWarns(targetJid);
        const successText = `✅ Todas as advertências de ${targetName} foram removidas com sucesso.`;
        await socket.sendMessage(remoteJid, { text: successText, mentions: [targetJid] });
        break;
      }

      default: {
        let reason;
        if (contextInfo?.mentionedJid?.[0]) {
            reason = args.slice(1).join(" ");
        } else {
            reason = args.join(" ");
        }
        const finalReason = reason || "Sem motivo especificado.";
        
        const updatedWarns = addWarn(targetJid, finalReason);
        const warnCount = updatedWarns.length;
        let replyMessage = `🫵⚠️ O usuário ${targetName} foi advertido.\n\n*Motivo:* ${finalReason}\n*Advertências:* ${warnCount}/3`;

        await socket.sendMessage(remoteJid, { text: replyMessage, mentions: [targetJid] });

        if (warnCount >= 3) {
          const banMessage = `🚫 *Limite atingido, removendo o usuário...*`;
          await socket.sendMessage(remoteJid, { text: banMessage, mentions: [targetJid] });
          
          setTimeout(() => {
            socket.groupParticipantsUpdate(remoteJid, [targetJid], "remove");
            clearWarns(targetJid);
          }, 1000);
        }
        break;
      }
    }
  },
};
