const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  activateAntiFake,
  deactivateAntiFake,
  isActiveAntiFake,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "antifake",
  description: "Ativa/desativa a remoção de números estrangeiros.",
  commands: ["antifake"],
  usage: `.antifake (1 para ligar / 0 para desligar)`,

  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length || !["1", "0"].includes(args[0])) {
      throw new InvalidParameterError("Você precisa digitar 1 (ligar) ou 0 (desligar)!");
    }

    const shouldActivate = args[0] === "1";
    const isCurrentlyActive = isActiveAntiFake(remoteJid);

    if ((shouldActivate && isCurrentlyActive) || (!shouldActivate && !isCurrentlyActive)) {
      const status = isCurrentlyActive ? "ativado" : "desativado";
      throw new WarningError(`O anti-fake já está ${status}!`);
    }

    if (shouldActivate) {
      activateAntiFake(remoteJid);
    } else {
      deactivateAntiFake(remoteJid);
    }

    await sendSuccessReact();
    const status = shouldActivate ? "ativado" : "desativado";
    await sendReply(`✔️ Sistema Anti-Fake ${status} com sucesso.`);
  },
};
