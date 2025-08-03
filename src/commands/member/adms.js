const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);

module.exports = {
  name: "adms",
  description: "Exibe a lista de administradores do grupo.",
  commands: ["adms", "listadmins"],
  usage: `${PREFIX}adms`,

  handle: async ({ 
    socket, 
    remoteJid,
    sendWaitReact,
    sendSuccessReact,
    sendReply
  }) => {

    await sendWaitReact();

    try {
      // 1. Pega os metadados do grupo, que incluem a lista de participantes
      const groupMetadata = await socket.groupMetadata(remoteJid);

      // 2. Filtra a lista, mantendo apenas quem for 'admin' ou 'superadmin'
      const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');

      if (!admins.length) {
        return sendReply("Não há administradores neste grupo (o que é estranho!).");
      }

      // 3. Monta a mensagem final
      let replyMessage = `*Administradores do Grupo*\n\n`;

      // Pega a lista de JIDs para a menção
      const mentions = admins.map(a => a.id);

      admins.forEach((admin, index) => {
        // Cria a menção @numero
        const userName = `@${admin.id.split('@')[0]}`;
        replyMessage += ` ${index + 1}. ${userName}\n`;
      });

      await sendSuccessReact();

      // Envia a mensagem com a lista de menções para que os nomes apareçam corretamente
      await socket.sendMessage(remoteJid, { text: replyMessage, mentions: mentions });

    } catch (error) {
        console.error("Erro ao listar administradores:", error);
        await sendReply(`❌ Ocorreu um erro ao tentar buscar a lista de administradores.`);
    }
  },
};
