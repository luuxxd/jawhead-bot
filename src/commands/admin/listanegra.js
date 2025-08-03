const { addToBlacklist, readBlacklist } = require(`${BASE_DIR}/utils/database`);
const { onlyNumbers } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "listanegra",
  description: "Adiciona um usuário à lista negra do grupo ou exibe a lista.",
  commands: ["listanegra"],
  usage: `.listanegra [@membro | responder | número]`,
  handle: async ({ args, webMessage, sendReply, socket, remoteJid }) => {
    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    let targetJid;
    if (contextInfo?.mentionedJid?.[0]) { targetJid = contextInfo.mentionedJid[0]; }
    else if (contextInfo?.participant) { targetJid = contextInfo.participant; }
    else if (args.length > 0) {
        const number = onlyNumbers(args.join(''));
        if (number) { targetJid = `${number}@s.whatsapp.net`; }
    }

    if (targetJid) {
      addToBlacklist(remoteJid, targetJid);
      await socket.sendMessage(remoteJid, { text: `✔️ O usuário @${targetJid.split('@')[0]} foi adicionado à lista negra do grupo.`, mentions: [targetJid] });
      return;
    }

    const blacklistDb = readBlacklist();
    const groupBlacklist = blacklistDb[remoteJid] || [];
    if (groupBlacklist.length === 0) { return sendReply("A lista negra do grupo está vazia."); }
    let message = "☠️ *LISTA NEGRA DO GRUPO* ☠️\n\n";
    groupBlacklist.forEach(jid => { message += `• @${jid.split('@')[0]}\n`; });
    await socket.sendMessage(remoteJid, { text: message, mentions: groupBlacklist });
  },
};
