const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'serdono',
  description: 'Define o primeiro dono do bot e o reinicia.',
  commands: ['serdono', 'setowner'],
  usage: '.serdono',

  handle: async ({ sendReply, webMessage, isGroup }) => {
    if (isGroup) {
      return sendReply("Este comando só pode ser usado no meu chat privado para sua segurança.");
    }

    const userJid = webMessage.key.remoteJid;
    const settingsPath = path.resolve(__dirname, '..', '..', 'settings.json');

    try {
      const settingsRaw = fs.readFileSync(settingsPath, 'utf8');
      const settings = JSON.parse(settingsRaw);

      if (settings.owner.numbers && settings.owner.numbers.length > 0) {
        return sendReply("❌ Este bot já possui um dono configurado.");
      }

      settings.owner.numbers.push(userJid.split('@')[0]);
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');

      await sendReply(`✅ Você foi definido como o dono principal! Reiniciado para aplicar suas novas permissões...`);

      const mainFilePath = path.resolve(__dirname, '..', '..', 'index.js');
      const now = new Date();
      fs.utimesSync(mainFilePath, now, now);

    } catch (error) {
      console.error("ERRO GRAVE no comando serdono:", error);
      return sendReply("❌ Ocorreu um erro grave ao tentar te definir como dono. Verifique o terminal.");
    }
  },
};
