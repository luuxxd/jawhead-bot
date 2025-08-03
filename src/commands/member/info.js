const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const commandInfoDb = require(`${BASE_DIR}/info.json`);

module.exports = {
  name: "info",
  description: "Mostra informações detalhadas sobre um comando.",
  commands: ["info", "ajuda"],
  usage: `${PREFIX}info [nome_do_comando]`,

  handle: async ({ args, sendReply }) => {
    const commandNameToFind = args[0];

    if (!commandNameToFind) {
      throw new InvalidParameterError("Você precisa me dizer qual comando quer consultar. Ex: `.info ban`");
    }

    const command = commandNameToFind.toLowerCase().replace(PREFIX, "");
    const commandData = commandInfoDb[command];

    if (!commandData) {
      return sendReply(`❌ O comando "${command}" não foi encontrado no meu manual. Verifique se você digitou o nome corretamente.`);
    }

    let infoMessage = `*ℹ️ Informações do Comando: ${command}*\n\n`;
    infoMessage += `*Função:* ${commandData.description || 'Nenhuma descrição fornecida.'}\n`;
    if (commandData.usage) {
      infoMessage += `*Exemplo de Uso:* \`${commandData.usage}\``;
    }

    const finalMessage = infoMessage.replace(/\$\{PREFIX\}/g, PREFIX);

    await sendReply(finalMessage);
  },
};
