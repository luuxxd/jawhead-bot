const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'reinicie',
  description: 'Reinicia o bot de forma limpa.',
  commands: ['reinicie', 'restart'],
  usage: '.reinicie',

  handle: async ({ sendReply, sendSuccessReact }) => {
    await sendSuccessReact();
    await sendReply("🦍✅ Reiniciando...");

    try {
    
      const mainFilePath = path.resolve(__dirname, '..', '..', 'index.js');

      const now = new Date();
      fs.utimesSync(mainFilePath, now, now);

    } catch (error) {
      console.error("Erro ao tentar reiniciar o bot:", error);
      await sendReply("❌ Ocorreu um erro ao tentar reiniciar.");
    }
  },
};
