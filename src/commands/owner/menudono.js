const { ownerMenu } = require(`${BASE_DIR}/menu`);

module.exports = {
  name: "menudono",
  description: "Exibe o menu de comandos de dono.",
  commands: ["menudono"],
  handle: async ({ socket, remoteJid, webMessage }) => {
    const userJid = webMessage.key.participant || webMessage.key.remoteJid;
    await socket.sendMessage(remoteJid, { 
        text: ownerMenu({ jid: userJid }), 
        mentions: [userJid] 
    });
  },
};
