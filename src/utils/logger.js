const { version } = require("../../package.json");

const BOT_NAME = "JAWHEAD BOT"; // Nome do bot usado em todos os logs

exports.sayLog = (message) => {
  console.log("\x1b[36m[" + BOT_NAME + " | TALK]\x1b[0m", message);
};

exports.inputLog = (message) => {
  console.log("\x1b[30m[" + BOT_NAME + " | INPUT]\x1b[0m", message);
};

exports.infoLog = (message) => {
  console.log("\x1b[34m[" + BOT_NAME + " | INFO]\x1b[0m", message);
};

exports.successLog = (message) => {
  console.log("\x1b[32m[" + BOT_NAME + " | SUCCESS]\x1b[0m", message);
};

exports.errorLog = (message) => {
  console.log("\x1b[31m[" + BOT_NAME + " | ERROR]\x1b[0m", message);
};

exports.warningLog = (message) => {
  console.log("\x1b[33m[" + BOT_NAME + " | WARNING]\x1b[0m", message);
};

exports.bannerLog = () => {
  console.log("\x1b[31m╱╱╭┳━━━┳╮╭╮╭┳╮╱╭┳━━━┳━━━┳━━━╮╱╱╭━━╮╭━━━┳━━━━╮\x1b[0m");
  console.log("\x1b[31m╱╱┃┃╭━╮┃┃┃┃┃┃┃╱┃┃╭━━┫╭━╮┣╮╭╮┃╱╱┃╭╮┃┃╭━╮┃╭╮╭╮┃\x1b[0m");
  console.log("\x1b[31m╱╱┃┃┃╱┃┃┃┃┃┃┃╰━╯┃╰━━┫┃╱┃┃┃┃┃┃╱╱┃╰╯╰┫┃╱┃┣╯┃┃╰╯\x1b[0m");
  console.log("\x1b[31m╭╮┃┃╰━╯┃╰╯╰╯┃╭━╮┃╭━━┫╰━╯┃┃┃┃┣━━┫╭━╮┃┃╱┃┃╱┃┃\x1b[0m");
  console.log("\x1b[31m┃╰╯┃╭━╮┣╮╭╮╭┫┃╱┃┃╰━━┫╭━╮┣╯╰╯┣━━┫╰━╯┃╰━╯┃╱┃┃\x1b[0m");
  console.log("\x1b[31m╰━━┻╯╱╰╯╰╯╰╯╰╯╱╰┻━━━┻╯╱╰┻━━━╯╱╱╰━━━┻━━━╯╱╰╯\x1b[0m");
  console.log(`\x1b[36m🤖 Versão: \x1b[0m${version}\n`);
};


