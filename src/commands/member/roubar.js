const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
  name: "roubar",
  description: "Rouba uma figurinha, alterando o autor e o nome do pacote.",
  commands: ["roubar", "steal"],
  usage: `${PREFIX}roubar (respondendo a uma figurinha)`,

  handle: async ({ 
    webMessage, 
    sendReply, 
    sendWaitMessage,
    socket,
    remoteJid
  }) => {
    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const quotedMsg = contextInfo?.quotedMessage;

    if (!quotedMsg || !quotedMsg.stickerMessage) {
      throw new InvalidParameterError("Você precisa responder a uma figurinha para usar este comando!");
    }

    try {
        // Recriamos o "envelope" completo da mensagem para o downloader
        const fullQuotedMessage = {
            key: {
                remoteJid,
                id: contextInfo.stanzaId,
                participant: contextInfo.participant
            },
            message: quotedMsg
        };

        const buffer = await downloadMediaMessage(
            fullQuotedMessage, // Passamos o "envelope" completo
            'buffer',
            {}
        );

        // Cria uma nova figurinha com os dados roubados
        const sticker = new Sticker(buffer, {
            pack: 'Roubado por',
            author: webMessage.pushName,
            type: StickerTypes.FULL,
            quality: 50,
        });

        // Envia a figurinha "roubada"
        await socket.sendMessage(remoteJid, await sticker.toMessage());

    } catch (error) {
        console.error("Erro ao roubar figurinha:", error);
        await sendReply(`❌ Ocorreu um erro. Não foi possível roubar esta figurinha. O formato pode não ser suportado.`);
    }
  },
};
