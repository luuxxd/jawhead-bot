const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "marcar",
  description: "Marca todos os membros do grupo com uma mensagem personalizada.",
  commands: ["marcar", "tagall", "todos"],
  usage: `${PREFIX}marcar (mensagem)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, webMessage, fullArgs, isGroup, isAdmin, groupMetadata }) => {
    const remoteJid = webMessage.key.remoteJid;

    if (!isGroup) {
      throw new InvalidParameterError("Este comando só pode ser usado em grupos!");
    }

    if (!isAdmin) {
      throw new InvalidParameterError("Apenas administradores podem usar este comando!");
    }

    const texto = fullArgs || "Marcação em grupo:";

    const mentions = groupMetadata.participants.map(p => p.id);
    const listaTags = mentions.map(id => "@" + id.split("@")[0]).join(" ");

    await socket.sendMessage(remoteJid, {
      text: `${texto}\n\n${listaTags}`,
      mentions
    }, { quoted: webMessage });
  }
};

