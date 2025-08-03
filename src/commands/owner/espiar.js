const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  activateSpyMode,
  deactivateSpyMode,
  isSpyModeActive,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "espiar",
  description: "Ativa/desativa a visualização automática de mensagens.",
  commands: ["espiar"],
  usage: `.espiar (1 para ligar / 0 para desligar)`,

  handle: async ({ args, sendReply, sendSuccessReact }) => {
    if (!args.length || !["1", "0"].includes(args[0])) {
      throw new InvalidParameterError("Você precisa digitar 1 (ligar) ou 0 (desligar)!");
    }

    const shouldActivate = args[0] === "1";
    const isCurrentlyActive = isSpyModeActive();

    if ((shouldActivate && isCurrentlyActive) || (!shouldActivate && !isCurrentlyActive)) {
      const status = isCurrentlyActive ? "ativado" : "desativado";
      throw new WarningError(`O modo espião já está ${status}!`);
    }

    if (shouldActivate) {
      activateSpyMode();
    } else {
      deactivateSpyMode();
    }

    await sendSuccessReact();
    const status = shouldActivate ? "ativado" : "desativado";
    await sendReply(`✔️ A visualização automática de mensagens foi ${status} com sucesso.`);
  },
};
