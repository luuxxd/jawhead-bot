const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  activateAntiLinkGp,
  deactivateAntiLinkGp,
  isActiveAntiLinkGp,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "antilinkgp",
  description: "Ativa/desativa a remoção por links de grupo.",
  commands: ["antilinkgp"],
  usage: `.antilinkgp (1 para ligar / 0 para desligar)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length || !["1", "0"].includes(args[0])) {
      throw new InvalidParameterError(
        "Você precisa digitar 1 (ligar) ou 0 (desligar)!"
      );
    }

    const shouldActivate = args[0] === "1";
    const isCurrentlyActive = isActiveAntiLinkGp(remoteJid);

    if (shouldActivate && isCurrentlyActive) {
      throw new WarningError("O anti-link de grupo já está ativado!");
    }

    if (!shouldActivate && !isCurrentlyActive) {
      throw new WarningError("O anti-link de grupo já está desativado!");
    }

    if (shouldActivate) {
      activateAntiLinkGp(remoteJid);
    } else {
      deactivateAntiLinkGp(remoteJid);
    }

    await sendSuccessReact();

    const status = shouldActivate ? "ativado" : "desativado";
    await sendReply(`✔️ Sistema Anti-Link de grupo ${status} com sucesso.`);
  },
};
