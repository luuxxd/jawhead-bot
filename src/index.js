const { connect } = require("./connection");
const { load } = require("./loader");
const { badMacHandler } = require("./utils/badMacHandler");
const {
  successLog,
  errorLog,
  warningLog,
  infoLog,
} = require("./utils/logger");
const settings = require("./settings.json");

process.on("uncaughtException", (error) => {
  if (badMacHandler.handleError(error, "uncaughtException")) {
    return;
  }
  errorLog(`Erro crítico não capturado: ${error.message}`);
  errorLog(error.stack);
  if (
    !error.message.includes("ENOTFOUND") &&
    !error.message.includes("timeout")
  ) {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason) => {
  if (badMacHandler.handleError(reason, "unhandledRejection")) {
    return;
  }
  errorLog(`Promessa rejeitada não tratada:`, reason);
});

async function startBot() {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    process.setMaxListeners(1500);
    console.log(`

╱╱╭┳━━━┳╮╭╮╭┳╮╱╭┳━━━┳━━━┳━━━╮╱╱╭━━╮╭━━━┳━━━━╮
╱╱┃┃╭━╮┃┃┃┃┃┃┃╱┃┃╭━━┫╭━╮┣╮╭╮┃╱╱┃╭╮┃┃╭━╮┃╭╮╭╮┃
╱╱┃┃┃╱┃┃┃┃┃┃┃╰━╯┃╰━━┫┃╱┃┃┃┃┃┃╱╱┃╰╯╰┫┃╱┃┣╯┃┃╰╯
╭╮┃┃╰━╯┃╰╯╰╯┃╭━╮┃╭━━┫╰━╯┃┃┃┃┣━━┫╭━╮┃┃╱┃┃╱┃┃
┃╰╯┃╭━╮┣╮╭╮╭┫┃╱┃┃╰━━┫╭━╮┣╯╰╯┣━━┫╰━╯┃╰━╯┃╱┃┃
╰━━┻╯╱╰╯╰╯╰╯╰╯╱╰┻━━━┻╯╱╰┻━━━╯╱╱╰━━━┻━━━╯╱╰╯

    `);

    infoLog("Iniciando meus componentes internos...");

    if (!settings.owner.numbers || settings.owner.numbers.length === 0) {
      warningLog("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      warningLog("!!!!!!!!! BOT SEM DONO CONFIGURADO !!!!!!!!!!");
      warningLog("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      infoLog("Para se tornar o dono do bot, siga os passos:");
      infoLog("1. No WhatsApp, inicie uma conversa no privado com o SEU número de dono com este bot.");
      infoLog(`2. Envie o comando: ${settings.bot.prefix}serdono`);
      infoLog("O bot irá te confirmar e reiniciar automaticamente.");
      warningLog("Apenas a PRIMEIRA pessoa a fazer isso se tornará a dona.");
      console.log("\n");  
    }

    const socket = await connect();
    load(socket);
    successLog("✅ Bot iniciado com sucesso!");

  } catch (error) {
    if (badMacHandler.handleError(error, "bot-startup")) {
      warningLog("Erro Bad MAC durante inicialização, tentando novamente...");
      setTimeout(() => {
        startBot();
      }, 5000);
      return;
    }
    errorLog(`Erro ao iniciar o bot: ${error.message}`);
    errorLog(error.stack);
    process.exit(1);
  }
}

startBot();
