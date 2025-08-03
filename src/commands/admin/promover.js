const { PREFIX } = require(`${BASE_DIR}/config`);
const { isGroup } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "promover",
  description: "Promove um usuário a administrador do grupo",
  commands: ["promover", "promove", "promote", "add-adm"],
  usage: `${PREFIX}promover @usuario ou respondendo a uma mensagem`,
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
      return sendWarningReply("Esse comando só pode ser usado em grupo!");
    }

    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const targetJid = contextInfo?.mentionedJid?.[0] || contextInfo?.participant;

    if (!targetJid) {
      return sendWarningReply("Por favor, marque um usuário ou responda a uma mensagem para promover.");
    }

    try {
      await socket.groupParticipantsUpdate(remoteJid, [targetJid], "promote");

      const targetName = `@${targetJid.split('@')[0]}`;
      await socket.sendMessage(remoteJid, { text: `✔️ ${targetName} agora é um *administrador*.`, mentions: [targetJid] });

    } catch (error) {
      errorLog(`Erro ao promover o usuário: ${error.message}`);
      await sendErrorReply(
        "Para realizar este comando eu primeiro preciso ser administrador."
      );
    }
  },
};
