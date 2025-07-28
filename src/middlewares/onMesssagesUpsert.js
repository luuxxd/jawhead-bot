const {
  isAtLeastMinutesInPast,
  GROUP_PARTICIPANT_ADD,
  GROUP_PARTICIPANT_LEAVE,
  isAddOrLeave,
} = require("../utils");
const { DEVELOPER_MODE } = require("../config");
const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { onGroupParticipantsUpdate } = require("./onGroupParticipantsUpdate");
const { errorLog, infoLog } = require("../utils/logger");
const { badMacHandler } = require("../utils/badMacHandler");
const { checkIfMemberIsMuted } = require("../utils/database");
const { messageHandler } = require("./messageHandler");

exports.onMessagesUpsert = async ({ socket, messages, startProcess }) => {
  if (!messages.length) {
    return;
  }

  for (const webMessage of messages) {
    try {
      if (DEVELOPER_MODE) {
        infoLog(`\n\n⪨========== [ MENSAGEM RECEBIDA ] ==========⪩ \n\n${JSON.stringify(messages, null, 2)}`);
      }

      if (isAtLeastMinutesInPast(webMessage.messageTimestamp)) {
        continue;
      }

      if (webMessage?.message) {
        const messageWasDeleted = await messageHandler(socket, webMessage);
        if (messageWasDeleted) {
          continue; // Se a mensagem foi deletada, pula para a próxima e não processa como comando
        }
      }

      if (isAddOrLeave.includes(webMessage.messageStubType)) {
        let action = "";
        if (webMessage.messageStubType === GROUP_PARTICIPANT_ADD) {
          action = "add";
        } else if (webMessage.messageStubType === GROUP_PARTICIPANT_LEAVE) {
          action = "remove";
        }

        await onGroupParticipantsUpdate({
          userJid: webMessage.messageStubParameters[0],
          remoteJid: webMessage.key.remoteJid,
          socket,
          action,
        });
      } else {
        const commonFunctions = loadCommonFunctions({ socket, webMessage });

        if (!commonFunctions) {
          continue;
        }

        if (checkIfMemberIsMuted(commonFunctions.remoteJid, commonFunctions.userJid)) {
          try {
            await commonFunctions.deleteMessage(webMessage.key);
          } catch (error) {
            errorLog(`Erro ao deletar mensagem de membro silenciado: ${error.message}`);
          }
          return;
        }

        await dynamicCommand(commonFunctions, startProcess);
      }
    } catch (error) {
      if (badMacHandler.handleError(error, "message-processing")) {
        continue;
      }
      if (badMacHandler.isSessionError(error)) {
        errorLog(`Erro de sessão ao processar mensagem: ${error.message}`);
        continue;
      }
      errorLog(`Erro ao processar mensagem: ${error.message}`);
      continue;
    }
  }
};
