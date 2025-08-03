const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const { readSecuritySettings, saveSecuritySettings } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "anticall",
  description: "Ativa/desativa o bloqueio de quem ligar para o bot.",
  commands: ["anticall", "antiligar"],
  usage: `.anticall (1 para ligar / 0 para desligar)`,
  handle: async ({ args, sendReply, sendSuccessReact }) => {
    if (!args.length || !["1", "0"].includes(args[0])) {
      throw new InvalidParameterError("Você precisa digitar 1 (ligar) ou 0 (desligar)!");
    }
    const settings = readSecuritySettings();
    const shouldActivate = args[0] === "1";

    if (shouldActivate === settings.antiCall) {
      throw new WarningError(`O anti-call já está ${shouldActivate ? "ativado" : "desativado"}!`);
    }
    settings.antiCall = shouldActivate;
    saveSecuritySettings(settings);
    await sendSuccessReact();
    await sendReply(`✔️ Sistema Anti-Ligações ${shouldActivate ? "ativado" : "desativado"} com sucesso.`);
  },
};
