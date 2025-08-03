const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { updateBotName } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "setnamebot",
  description: "Define o novo nome do bot.",
  commands: ["setnamebot"],
  usage: `.setnamebot [novo nome]`,

  handle: async ({ fullArgs, sendReply, sendSuccessReact }) => {
    if (!fullArgs) {
      throw new InvalidParameterError("Você precisa me dizer qual será o novo nome do bot.");
    }

    const { oldName, newName } = updateBotName(fullArgs);

    await sendSuccessReact();
    await sendReply(`✔️ O nome do bot foi alterado de "${oldName}" para "${newName}".`);
  },
};
