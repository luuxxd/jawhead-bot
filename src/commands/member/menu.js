const { mainMenu } = require(`${BASE_DIR}/menu`);
const path = require("path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "menu",
  description: "Menu principal de comandos",
  commands: ["menu", "help"],
  handle: async ({ socket, remoteJid, webMessage }) => {
    const userJid = webMessage.key.participant || webMessage.key.remoteJid;
    await socket.sendMessage(remoteJid, { 
        image: { url: path.join(ASSETS_DIR, "images", "takeshi-bot.png") },
        caption: mainMenu({ jid: userJid }),
        mentions: [userJid]
    });
  },
};
