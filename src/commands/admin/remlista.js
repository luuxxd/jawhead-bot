const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { removeFromBlacklist, isBlacklisted } = require(`${BASE_DIR}/utils/database`);
const { onlyNumbers } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "remlista",
  description: "Remove um usuário da lista negra do grupo.",
  commands: ["remlista"],
  usage: `.remlista [@membro | responder | número]`,
  handle: async ({ args, webMessage, socket, remoteJid }) => {
    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    let targetJid;
    if (contextInfo?.mentionedJid?.[0]) { targetJid = contextInfo.mentionedJid[0]; }
    else if (contextInfo?.participant) { targetJid = contextInfo.participant; }
    else if (args.length > 0) {
        const number = onlyNumbers(args.join(''));
        if (number) { targetJid = `${number}@s.whatsapp.net`; }
    }

    if (!targetJid) { throw new InvalidParameterError("Você precisa fornecer um alvo para remover."); }
    
    if (!isBlacklisted(remoteJid, targetJid)) {
        const notFoundText = `O usuário @${targetJid.split('@')[0]} não está na lista negra deste grupo.`;
        return socket.sendMessage(remoteJid, { text: notFoundText, mentions: [targetJid] });
    }
    
    removeFromBlacklist(remoteJid, targetJid);
    
    const replyText = `✔️ O usuário @${targetJid.split('@')[0]} foi removido da lista negra deste grupo.`;
    await socket.sendMessage(remoteJid, { text: replyText, mentions: [targetJid] });
  },
};
