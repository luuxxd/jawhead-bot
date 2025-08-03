const settings = require(`${BASE_DIR}/settings.json`);

module.exports = {
  name: "bot",
  description: "Exibe informações sobre o bot.",
  commands: ["bot", "infobot"],
  usage: `.bot`,

  handle: async ({ sendReply }) => {
    const botName = settings.bot.name || "Nome não definido";

    const ownerNumber = settings.owner.numbers[0] || "Dono não definido";

    const botInfo = `*🤖 Informações sobre o ${botName}*\n\n` +
                    `*Nome:* ${botName}\n` +
                    `*Dono:* wa.me/${ownerNumber}\n` +
                    `*Versão:* 1.0.0\n` +
                    `*GitHub:* https://github.com/luuxxd/jawhead-bot\n\n` +
                    `Para ver a lista de comandos, use *.menu*.`;

    await sendReply(botInfo);
  },
};
