const { updateBotPrefixAsync } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: 'setprefix',
  description: 'Altera o prefixo de comandos do bot.',
  commands: ['setprefix', 'prefixo'],
  usage: '.setprefix [novo_prefixo]',

  handle: async ({ args, sendReply, sendSuccessReact }) => {
    const newPrefixArg = args[0];

    if (!newPrefixArg || newPrefixArg.length > 1) {
      return sendReply("❌ Erro: Forneça um prefixo de 1 caractere.");
    }

    try {
      // 1. Chama a função assíncrona e ESPERA ela terminar
      const { oldPrefix, newPrefix, changed } = await updateBotPrefixAsync(newPrefixArg);

      // 2. SÓ DEPOIS que o arquivo foi salvo, ele continua para enviar a resposta
      if (!changed) {
        return sendReply(`⚠️ O prefixo já está definido como "${newPrefix}".`);
      }

      await sendSuccessReact();
      await sendReply(`🦍✅ Prefixo alterado para *"${newPrefix}"* com sucesso.\n\n⚠️ Por favor, me reinicie para que a alteração tenha efeito.`);

    } catch (error) {
      console.error("ERRO GRAVE no comando setprefix:", error);
      return sendReply("❌ Ocorreu um erro grave ao tentar alterar o prefixo. Verifique o terminal.");
    }
  },
};
