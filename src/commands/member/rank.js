const { readRanking } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "rank",
  description: "Exibe o ranking dos 10 membros mais ativos do grupo.",
  commands: ["rank", "ranking"],
  usage: `.rank`,

  handle: async ({ sendReply, remoteJid, socket }) => {
    const rankingData = readRanking();
    const groupRanking = rankingData[remoteJid];

    const groupMetadata = await socket.groupMetadata(remoteJid);
    const groupName = groupMetadata.subject;

    if (!groupRanking || Object.keys(groupRanking).length === 0) {
      return sendReply(`Ainda não há um ranking para o grupo "${groupName}". Conversem mais um pouco!`);
    }

    const sortedRank = Object.entries(groupRanking)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    let replyMessage = `🏆 *RANKING DE MENSAGENS*\n\n`;

    const participants = groupMetadata.participants;

    sortedRank.forEach(([jid, count], index) => {
      const participantInfo = participants.find(p => p.id === jid);
      const userName = participantInfo?.pushName || `➤ @${jid.split('@')[0]}`;

      const medal = ["🥇", "🥈", "🥉"][index] || `${index + 1}.`;
      replyMessage += `${medal} ${userName} - *${count}* mensagens\n`;
    });

    const mentions = sortedRank.map(([jid]) => jid);
    await socket.sendMessage(remoteJid, { text: replyMessage, mentions: mentions });
  },
};
