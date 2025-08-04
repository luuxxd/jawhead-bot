const { getContent, compareUserJidWithOtherNumber, getGreeting } = require("../utils");
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
    const userJid = webMessage.key.participant || webMessage.key.remoteJid;

    if (fromMe || !userJid) {
      return false;
    }

    const messageText =
      webMessage.message?.conversation ||
      webMessage.message?.extendedTextMessage?.text ||
      "";

    const configuredPrefix = require("../settings.json").bot.prefix || PREFIX;

    if (messageText.trim().toLowerCase() === 'prefixo') {
        const replyText = `Meu prefixo é: *${configuredPrefix}*`;
        await socket.sendMessage(remoteJid, { text: replyText }, { quoted: webMessage });
        return true;
    }

    if (messageText.trim() === configuredPrefix) {
      const replyText = `${getGreeting()}, @${userJid.split("@")[0]}!\n\nSe quiser acessar meus comandos, use *${configuredPrefix}menu*`;
      await socket.sendMessage(remoteJid, { text: replyText, mentions: [userJid] }, { quoted: webMessage });
      return true;
    }

    if (!remoteJid.includes("@g.us")) {
      return false;
    }

    const isUserAdmin = await isAdmin({ remoteJid, userJid, socket });
    const isBotOwner =
      compareUserJidWithOtherNumber({ userJid, otherNumber: OWNER_NUMBER }) ||
      userJid === OWNER_LID;

    if (isBotOwner || isUserAdmin) {
      return false;
    }

    if (isActiveAntiLinkGp(remoteJid)) {
      if (isWhatsAppGroupLink(messageText)) {
        infoLog(`[AntiLinkGP] Link de grupo detectado de ${userJid}. Iniciando protocolo...`);
        await socket.groupSettingUpdate(remoteJid, 'announcement');
        await socket.sendMessage(remoteJid, { text: `Link de grupo detectado, removendo beta...` });
        await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");
        setTimeout(async () => {
          await socket.groupSettingUpdate(remoteJid, 'not_announcement');
          await socket.sendMessage(remoteJid, { text: `Segurança restaurada, beta removido.` });
        }, 5000);
        return true;
      }
    }

    const groupRestrictions = readGroupRestrictions();
    const thisGroupRestrictions = groupRestrictions[remoteJid];

    if (!thisGroupRestrictions) return false;

    const messageType = Object.keys(thisGroupRestrictions).find((type) =>
      getContent(webMessage, type.replace("anti-", ""))
    );

    if (messageType && thisGroupRestrictions[messageType]) {
      await socket.sendMessage(remoteJid, { delete: webMessage.key });
      return true;
    }
  } catch (error) {
    errorLog(`Erro no messageHandler: ${error.message}`);
  }

  return false;
};
