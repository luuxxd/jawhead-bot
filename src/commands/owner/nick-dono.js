const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { updateOwnerName } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "nickdono", // Nome interno claro
  description: "Define o novo nome/nick do dono no bot.",
  commands: ["nickdono", "nick-dono"], // Os dois apelidos que você quer
  usage: `.nickdono [novo nome]`,

  handle: async ({ fullArgs, sendReply, sendSuccessReact }) => {
    if (!fullArgs) {
      throw new InvalidParameterError("Você precisa me dizer qual será o novo nome do dono.");
    }

    const { oldName, newName } = updateOwnerName(fullArgs);

    await sendSuccessReact();
    await sendReply(`Nome do Dono configurado, estou aos seus comandos *${newName}*!`);
  },
};
