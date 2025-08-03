const {
  DangerError,
  WarningError,
  InvalidParameterError,
} = require("../errors");
const { findCommandImport } = require(".");
const {
  isLink,
  isAdmin,
  checkPermission,
  isBotOwner,
} = require("../middlewares");
const {
  isActiveGroup,
  getAutoResponderResponse,
  isActiveAutoResponderGroup,
  isActiveAntiLinkGroup,
  isActiveOnlyAdmins,
} = require("./database");
const { errorLog } = require("../utils/logger");
const settings = require("../settings.json");

exports.dynamicCommand = async (paramsHandler, startProcess) => {
  const {
    commandName,
    prefix,
    sendWarningReply,
    sendErrorReply,
    sendReply,
    remoteJid,
    socket,
    userJid,
    fullMessage,
    webMessage,
    isLid,
    isGroup,
  } = paramsHandler;

  const { type, command } = findCommandImport(commandName);

  // Se um comando não for encontrado...
  if (!command) {
    // ...e a mensagem começar com o prefixo (ou seja, foi uma tentativa de comando)...
    if (prefix === settings.bot.prefix) {
      await sendReply(`Comando inválido! Para saber os meus comandos use *${settings.bot.prefix}menu*`);
    } 
    else if (isGroup && isActiveAutoResponderGroup(remoteJid)) {
        const response = getAutoResponderResponse(fullMessage);
        if (response) await sendReply(response);
    }
    return;
  }
  // --- FIM DA LÓGICA ---

  if (isBotOwner({ userJid, isLid })) {
      try {
          await command.handle({ ...paramsHandler, type, startProcess });
      } catch (error) {
          errorLog("Erro ao executar comando (dono):", error);
          await sendErrorReply(`Ocorreu um erro no comando ${command.name}!\n\n*Detalhes*: ${error.message}`);
      }
      return;
  }

  if (isGroup) {
    const activeGroup = isActiveGroup(remoteJid);

    if (!activeGroup) {
        if (command.name === 'on' && await isAdmin({ remoteJid, userJid, socket })) {
            await command.handle(paramsHandler);
        } else {
            return sendWarningReply("Os comandos neste grupo estão desativados, peça para um administrador ativá-lo com o comando .on");
        }
        return;
    }

    if (isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
      if (!(await isAdmin({ remoteJid, userJid, socket }))) {
        await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");
        await sendReply("Anti-link ativado! Você foi removido por enviar um link!");
        await socket.sendMessage(remoteJid, { delete: webMessage.key });
        return;
      }
    }

    if (command.name !== 'revelar' && !(await checkPermission({ type, ...paramsHandler }))) {
      return sendErrorReply("Você não tem permissão para executar este comando.");
    }

    if (isActiveOnlyAdmins(remoteJid) && !(await isAdmin({ remoteJid, userJid, socket }))) {
      return sendWarningReply("Somente administradores podem executar comandos.");
    }
  }

  try {
    await command.handle({ ...paramsHandler, type, startProcess });
  } catch (error) {
    errorLog("Erro ao executar comando:", error);
    await sendErrorReply(`Ocorreu um erro ao executar o comando ${command.name}!\n\n*Detalhes*: ${error.message}`);
  }
};
