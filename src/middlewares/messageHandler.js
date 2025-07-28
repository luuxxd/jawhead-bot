const { getContent, compareUserJidWithOtherNumber } = require("../utils");
const { errorLog, infoLog } = require("../utils/logger");
const {
  readGroupRestrictions,
  isActiveAntiLinkGp,
} = require("../utils/database");
const { BOT_NUMBER, OWNER_NUMBER, OWNER_LID, PREFIX } = require("../config");
const { isWhatsAppGroupLink, isAdmin } = require("../middlewares");

exports.messageHandler = async (socket, webMessage) => {
  try {
    const { remoteJid, fromMe } = webMessage.key;
    const userJid = webMessage.key.participant;

    if (fromMe || !userJid) {
      return;
    }

    const messageText =
      webMessage.message?.conversation ||
      webMessage.message?.extendedTextMessage?.text ||
      "";

    const configuredPrefix = require("../settings.json").bot.prefix || PREFIX;
    if (messageText.trim() === configuredPrefix) {
      const replyText = `Olá @${userJid.split("@")[0]}, para mais informações use (${configuredPrefix})menu para acessar meus comandos.`;
      await socket.sendMessage(remoteJid, { text: replyText, mentions: [userJid] }, { quoted: webMessage });
      return;
    }

    if (!remoteJid.includes("@g.us")) {
      return;
    }

    const isUserAdmin = await isAdmin({ remoteJid, userJid, socket });
    const isBotOwner =
      compareUserJidWithOtherNumber({ userJid, otherNumber: OWNER_NUMBER }) ||
      userJid === OWNER_LID;

    if (isBotOwner || isUserAdmin) {
      return;
    }

    if (isActiveAntiLinkGp(remoteJid)) {
      if (isWhatsAppGroupLink(messageText)) {
        infoLog(
          `[AntiLinkGP] Link de grupo detectado de ${userJid}. Iniciando protocolo de segurança...`
        );

        await socket.groupSettingUpdate(remoteJid, 'announcement');
        await socket.sendMessage(remoteJid, { text: `Link detectado, removendo beta...` });
        await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");

        setTimeout(async () => {
          await socket.groupSettingUpdate(remoteJid, 'not_announcement');
          await socket.sendMessage(remoteJid, { text: `Beta removido, o grupo foi aberto novamente.` });
          infoLog(`[AntiLinkGP] Protocolo finalizado. Grupo ${remoteJid} reaberto.`);
        }, 5000);

        return;
      }
    }

    const groupRestrictions = readGroupRestrictions();
    const thisGroupRestrictions = groupRestrictions[remoteJid];

    if (!thisGroupRestrictions) return;

    const messageType = Object.keys(thisGroupRestrictions).find((type) =>
      getContent(webMessage, type.replace("anti-", ""))
    );

    if (messageType && thisGroupRestrictions[messageType]) {
      await socket.sendMessage(remoteJid, { delete: webMessage.key });
    }
  } catch (error) {
    errorLog(`Erro no messageHandler: ${error.message}`);
  }
};
