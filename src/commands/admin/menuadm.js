const { adminMenu } = require(`${BASE_DIR}/menu`);

module.exports = {
  name: "menuadm",
  description: "Exibe o menu de comandos de admin.",
  commands: ["menuadm"],
  handle: async ({ socket, remoteJid, webMessage }) => {
    const userJid = webMessage.key.participant || webMessage.key.remoteJid;
    await socket.sendMessage(remoteJid, { 
        text: adminMenu({ jid: userJid }), 
        mentions: [userJid] 
    });
  },
};
