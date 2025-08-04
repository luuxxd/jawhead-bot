const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');
const path = require('path');

module.exports = {
  name: "revelar",
  description: "Revela uma mídia de visualização única, preservando a legenda original.",
  commands: ["revelar"],
  usage: `.revelar (respondendo a uma mídia de visu única)`,

  handle: async ({ 
    webMessage, 
    sendReply, 
    sendWaitReact, 
    sendSuccessReact, 
    socket, 
    remoteJid, 
    sendImageFromFile, 
    sendVideoFromFile 
  }) => {
    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const quotedMsg = contextInfo?.quotedMessage;

    const viewOnceMsg = quotedMsg?.viewOnceMessageV2?.message || quotedMsg?.viewOnceMessage?.message;

    if (!viewOnceMsg) {
      throw new InvalidParameterError("Você precisa responder a uma foto ou vídeo de visualização única para usar este comando.");
    }

    const type = Object.keys(viewOnceMsg)[0];
    const mediaMessage = viewOnceMsg[type];

    if (!mediaMessage) {
        return sendReply("Não foi possível extrair a mídia da mensagem.");
    }

    await sendWaitReact();

    try {
        const buffer = await downloadMediaMessage(
            { key: { remoteJid, id: contextInfo.stanzaId, participant: contextInfo.participant }, message: quotedMsg },
            'buffer',
            {}
        );

        const tempFilePath = path.join(__dirname, `temp_media_${Date.now()}`);
        await writeFile(tempFilePath, buffer);

        await sendSuccessReact();

        // --- AQUI ESTÁ A MÁGICA ---
        // 1. Pega a legenda original da mídia, se existir.
        const originalCaption = mediaMessage.caption || "";
        // --- FIM DA MÁGICA ---

        if (type === 'imageMessage') {
            // 2. Envia a imagem com a legenda original (ou sem legenda, se não houver)
            await sendImageFromFile(tempFilePath, originalCaption, [], true);
        } else if (type === 'videoMessage') {
            await sendVideoFromFile(tempFilePath, originalCaption, [], true);
        }

    } catch (error) {
        console.error("Erro ao revelar mídia:", error);
        await sendReply("Ocorreu um erro ao tentar revelar a mídia. O arquivo pode ter expirado ou já ter sido aberto.");
    }
  },
};
