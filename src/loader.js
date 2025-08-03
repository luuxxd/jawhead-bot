const { TIMEOUT_IN_MILLISECONDS_BY_EVENT } = require("./config");
const { onMessagesUpsert } = require("./middlewares/onMesssagesUpsert");
const path = require("node:path");
const { errorLog, infoLog } = require("./utils/logger");
const { badMacHandler } = require("./utils/badMacHandler");
const { isBlacklisted, isActiveGroup, isActiveAntiFake, readSecuritySettings, isSpyModeActive } = require("./utils/database");
const { isBotOwner } = require("./middlewares");

exports.load = (socket) => {
  global.BASE_DIR = path.resolve(__dirname);

  socket.ev.on('call', async (call) => {
    const settings = readSecuritySettings();
    const callerId = call[0].from;
    if (settings.antiCall && !isBotOwner({ userJid: callerId })) {
        infoLog(`[ANTI-CALL] Ligação recebida de ${callerId}. Bloqueando...`);
        await socket.sendMessage(callerId, { text: "Não posso atender ligações, você será bloqueado para evitar spam..." });
        await socket.updateBlockStatus(callerId, "block");
    } else if (settings.antiCall && isBotOwner({ userJid: callerId })) {
        infoLog(`[ANTI-CALL] Ligação do dono ${callerId} recebida e ignorada com segurança.`);
    }
  });

  socket.ev.on("group-participants.update", async (data) => {
  });

  const safeEventHandler = async (callback, data, eventName) => {
    try { await callback(data); } catch (error) {
      if (badMacHandler.handleError(error, eventName)) return;
      errorLog(`Erro ao processar evento ${eventName}: ${error.message}`);
      if (error.stack) errorLog(`Stack trace: ${error.stack}`);
    }
  };

  socket.ev.on("messages.upsert", async (data) => {
    try {
      if (isSpyModeActive() && data.messages[0]) {
        const webMessage = data.messages[0];
        const isGroup = webMessage.key.remoteJid?.endsWith('@g.us');
        if (isGroup && !webMessage.key.fromMe) {
          await socket.readMessages([webMessage.key]);
        }
      }
    } catch (e) {
      errorLog("Erro no modo espião:", e);
    }

    const startProcess = Date.now();
    setTimeout(() => {
      safeEventHandler(() => onMessagesUpsert({ socket, messages: data.messages, startProcess }), data, "messages.upsert");
    }, TIMEOUT_IN_MILLISECONDS_BY_EVENT);
  });

  process.on("uncaughtException", (error) => {
    if (badMacHandler.handleError(error, "uncaughtException")) return;
    errorLog(`Erro não capturado: ${error.message}`);
  });

  process.on("unhandledRejection", (reason) => {
    if (badMacHandler.handleError(reason, "unhandledRejection")) return;
    errorLog(`Promessa rejeitada não tratada: ${reason}`);
  });
};
