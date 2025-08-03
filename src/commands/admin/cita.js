const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  name: "citar",
  description: "Marca todos os membros com uma mensagem.",
  commands: ["cita", "tagall", "hidetag"],
  usage: `${PREFIX}cita [mensagem] ou respondendo a uma mensagem/mídia`,

  handle: async ({ 
    fullArgs, 
    webMessage,
    socket, 
    remoteJid,
    sendWaitReact,
    sendSuccessReact
  }) => {
    await sendWaitReact();

    const groupMetadata = await socket.groupMetadata(remoteJid);
    const participants = groupMetadata.participants.map(p => p.id);

    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const quotedMsg = contextInfo?.quotedMessage;

    const customText = fullArgs || "";

    if (quotedMsg) {
        const mediaType = Object.keys(quotedMsg)[0];
        const isMedia = mediaType === 'imageMessage' || mediaType === 'videoMessage';

        if (isMedia) {
            try {
                const buffer = await downloadMediaMessage(
                    { key: { remoteJid, id: contextInfo.stanzaId, participant: contextInfo.participant }, message: quotedMsg },
                    'buffer',
                    {}
                );

                const originalCaption = quotedMsg.imageMessage?.caption || quotedMsg.videoMessage?.caption || "";

                const finalCaption = originalCaption ? `${originalCaption} ${customText}` : customText;

                if (mediaType === 'imageMessage') {
                    await socket.sendMessage(remoteJid, { image: buffer, caption: finalCaption, mentions: participants });
                } else if (mediaType === 'videoMessage') {
                    await socket.sendMessage(remoteJid, { video: buffer, caption: finalCaption, mentions: participants });
                }
            } catch (e) {
                console.error("Erro ao baixar mídia para o comando .cita:", e);
                await socket.sendMessage(remoteJid, { text: `Não foi possível reenviar a mídia, mas aqui está a mensagem: ${customText}`, mentions: participants });
            }
        } else {
            const originalText = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || "";
            const finalText = `${originalText} ${customText}`;
            await socket.sendMessage(remoteJid, { text: finalText, mentions: participants });
        }
    } else {
        await socket.sendMessage(remoteJid, { text: customText, mentions: participants });
    }

    await sendSuccessReact();
  },
};
