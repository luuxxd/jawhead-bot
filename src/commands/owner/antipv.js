const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const { readSecuritySettings, saveSecuritySettings } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "antipv",
  description: "Ativa/desativa o aviso para comandos no privado.",
  commands: ["antipv"],
  usage: `.antipv (1 para ligar / 0 para desligar)`,
  handle: async ({ args, sendReply, sendSuccessReact }) => {
    if (!args.length || !["1", "0"].includes(args[0])) {
      throw new InvalidParameterError("Você precisa digitar 1 (ligar) ou 0 (desligar)!");
    }
    const settings = readSecuritySettings();
    const shouldActivate = args[0] === "1";

    if (shouldActivate === settings.antiPv) {
      throw new WarningError(`O anti-privado (aviso) já está ${shouldActivate ? "ativado" : "desativado"}!`);
    }
    settings.antiPv = shouldActivate;
    saveSecuritySettings(settings);
    await sendSuccessReact();
    await sendReply(`✔️ O sistema Anti-Privado (modo aviso) foi ${shouldActivate ? "ativado" : "desativado"} com sucesso.`);
  },
};
