const { isAtLeastMinutesInPast } = require("../utils");
const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { errorLog, infoLog } = require("../utils/logger");
const { messageHandler } = require("./messageHandler");
const { readSecuritySettings } = require("../utils/database");
const { isBotOwner } = require("../middlewares");

exports.onMessagesUpsert = async ({ socket, messages }) => {
  if (!messages.length) {
    return;
  }

  const webMessage = messages[0];

  try {
    const isGroup = webMessage.key.remoteJid?.endsWith('@g.us');
    const userJid = webMessage.key.participant || webMessage.key.remoteJid;

    // --- LÓGICA ANTI-PV ---
    if (!isGroup && !isBotOwner({ userJid, isLid: userJid.endsWith('@lid') })) {
        const settings = readSecuritySettings();
        const messageText = webMessage.message?.conversation || webMessage.message?.extendedTextMessage?.text || "";
        const prefix = require("../settings.json").bot.prefix;

        if (messageText.startsWith(prefix)) {
            if (settings.antiPvHard) {
                await socket.sendMessage(userJid, { text: "🚫 Você foi bloqueado por usar comandos no meu privado." });
                await socket.updateBlockStatus(userJid, "block");
                infoLog(`[Anti-PV Hard] Usuário ${userJid} bloqueado por usar comando no privado.`);
                return; // Para a execução
            } else if (settings.antiPv) {
                await socket.sendMessage(userJid, { text: "Olá! Por favor, use meus comandos nos grupos." });
                return; // Para a execução
            }
        }
    }
    // --- FIM DA LÓGICA ---

    const hasContent = webMessage.message;
    if (isGroup && hasContent && !webMessage.key.fromMe) {
      try {
        const senderName = webMessage.pushName || "Desconhecido";
        const senderNumber = webMessage.key.participant.split('@')[0];
        const groupMetadata = await socket.groupMetadata(webMessage.key.remoteJid);
        const groupName = groupMetadata.subject;
        const messageContent = webMessage.message.conversation || webMessage.message.extendedTextMessage?.text || "[Mídia]";
        infoLog(`[CHAT] Grupo: "${groupName}" | ${senderName} (${senderNumber}): "${messageContent}"`);
      } catch (e) {}
    }

    if (isAtLeastMinutesInPast(webMessage.messageTimestamp)) {
      return;
    }

    if (hasContent) {
      const messageWasHandled = await messageHandler(socket, webMessage);
      if (messageWasHandled) {
        return;
      }
    }

    const commonFunctions = loadCommonFunctions({ socket, webMessage });
    if (commonFunctions) {
      await dynamicCommand(commonFunctions);
    }

  } catch (error) {
    errorLog(`Erro grave no onMessagesUpsert: ${error.message}`);
  }
};
