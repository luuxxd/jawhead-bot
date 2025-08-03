const { readRanking } = require(`${BASE_DIR}/utils/database`);
const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);

module.exports = {
  name: "inativos",
  description: "Exibe a lista de membros com menos de 5 mensagens no grupo.",
  commands: ["inativos", "fantasmas"],
  usage: `${PREFIX}inativos`,

  handle: async ({ 
    socket, 
    remoteJid,
    sendReply
  }) => {
    const rankingData = readRanking();
    const groupRanking = rankingData[remoteJid] || {};

    // 1. Pega a lista de todos os participantes atuais do grupo
    const groupMetadata = await socket.groupMetadata(remoteJid);
    const participants = groupMetadata.participants.map(p => p.id);

    // 2. Filtra a lista de participantes para encontrar os inativos
    const inactiveMembers = participants.filter(jid => {
      const messageCount = groupRanking[jid] || 0; // Se o membro nunca falou, a contagem é 0
      return messageCount < 5;
    });

    if (inactiveMembers.length === 0) {
      return sendReply("Parece que não há membros inativos neste grupo.");
    }

    // 3. Monta a mensagem final
    let replyMessage = `*Usuários com menos de 5 mensagens no grupo:*\n\n`;

    inactiveMembers.forEach((jid, index) => {
      const messageCount = groupRanking[jid] || 0;
      replyMessage += `${index + 1}. ➤ @${jid.split('@')[0]} - *${messageCount}* msgs\n`;
    });

    replyMessage += `\nTotal de *${inactiveMembers.length}* membros inativos.`;

    await socket.sendMessage(remoteJid, { text: replyMessage, mentions: inactiveMembers });
  },
};
