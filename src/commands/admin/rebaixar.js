const { PREFIX } = require(`${BASE_DIR}/config`);
const { isGroup } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "rebaixar",
  description: "Rebaixa um administrador para membro comum",
  commands: ["rebaixar", "rebaixa", "demote"],
  usage: `${PREFIX}rebaixar @usuario ou respondendo a uma mensagem`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    webMessage,
    remoteJid,
    socket,
    sendWarningReply,
    sendSuccessReply,
    sendErrorReply,
  }) => {
    if (!isGroup(remoteJid)) {
      return sendWarningReply("Este comando só pode ser usado em grupo !");
    }

    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const targetJid = contextInfo?.mentionedJid?.[0] || contextInfo?.participant;

    if (!targetJid) {
      return sendWarningReply("Por favor, marque um administrador ou responda a uma mensagem para rebaixar.");
    }

    try {
      await socket.groupParticipantsUpdate(remoteJid, [targetJid], "demote");

      const targetName = `@${targetJid.split('@')[0]}`;
      await socket.sendMessage(remoteJid, { text: `✔️ ${targetName} betinha rebaixado(a) para membro comum.`, mentions: [targetJid] });

    } catch (error) {
      errorLog(`Erro ao rebaixar administrador: ${error.message}`);
      await sendErrorReply(
        "Para realizar este comando eu preciso ser administrador."
      );
    }
  },
};
