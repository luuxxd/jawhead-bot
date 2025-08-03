const { suporteMenu } = require(`${BASE_DIR}/menu`);
const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);

module.exports = {
  name: "suporte",
  description: "Exibe o menu de suporte.",
  commands: ["suporte"],
  usage: `${PREFIX}suporte`,

  handle: async ({ socket, remoteJid, webMessage }) => {
    // Pega o JID do usuário, funcionando tanto em grupo quanto no privado
    const userJid = webMessage.key.participant || webMessage.key.remoteJid;

    // Chama a função de menu, passando o JID para a criação da menção
    const menuText = suporteMenu({ jid: userJid });

    // Envia a mensagem usando o método que garante a menção
    await socket.sendMessage(remoteJid, { text: menuText, mentions: [userJid] });
  },
};
