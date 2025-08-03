const { OWNER_NUMBER } = require("../../config");
const { PREFIX, BOT_NUMBER } = require(`${BASE_DIR}/config`);
const { DangerError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "ban",
  description: "Remove um membro do grupo.",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban [@membro | responder]`,

  handle: async ({
    socket,
    remoteJid,
    userJid,
    webMessage,
    sendReply,
    sendSuccessReact,
  }) => {
    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const targetJid = contextInfo?.mentionedJid?.[0] || contextInfo?.participant;

    if (!targetJid) {
      throw new InvalidParameterError("Você precisa mencionar ou responder a um membro!");
    }

    const targetNumber = onlyNumbers(targetJid);
    if (targetJid === userJid) throw new DangerError("Você não pode remover você mesmo, masoquista.");
    if (targetNumber === OWNER_NUMBER) throw new DangerError("Você não pode remover o meu dono");
    if (targetJid === toUserJid(BOT_NUMBER)) throw new DangerError("Você não pode me remover.");

    try {

      await socket.groupParticipantsUpdate(remoteJid, [targetJid], "remove");
      await sendSuccessReact();

      const targetName = `@${targetJid.split('@')[0]}`;
      const finalMessage = `${targetName} tomou no cu com sucesso.`;
      await socket.sendMessage(remoteJid, { text: finalMessage, mentions: [targetJid] });

    } catch (error) {
        console.error("Erro ao banir usuário:", error);
        await sendReply("Para usar este comando eu primeiro preciso ser administrador.");
    }
  },
};
