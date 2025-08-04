const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const path = require("path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "gay",
  description: "Mede o nível de viadagem de um membro.",
  commands: ["gay"],
  usage: `${PREFIX}gay [@membro | responder]`,

  handle: async ({ 
    webMessage,
    sendImageFromFile
  }) => {
    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const targetJid = contextInfo?.mentionedJid?.[0] || contextInfo?.participant;

    if (!targetJid) {
      throw new InvalidParameterError("Você precisa marcar alguém para medir o nível de viadagem!");
    }

    const gayPercentage = Math.floor(Math.random() * 100) + 1;
    const targetName = `@${targetJid.split('@')[0]}`;

    let caption;
    let imageName;

    if (gayPercentage <= 1) {
      imageName = "1.png";
      caption = `*Based*! Com ${gayPercentage}%, ${targetName} provou ser o grande papa xotas do grupo\n\nAos betinhas, resta apenas saudarem o verdadeiro *MACHO ALFA*! 💪`;
    } else if (gayPercentage <= 10) {
      imageName = "10.png";
      caption = `${targetName} chegou a miseráveis ${gayPercentage}% no viadômetro. Quase, hein!`;
    } else if (gayPercentage <= 20) {
      imageName = "20.png";
      caption = `Ixi!\n\n${targetName} é ${gayPercentage}% gay... Hmmmmm, tenho minhas dúvidas... 🤔`;
    } else if (gayPercentage <= 40) {
      imageName = "40.png";
      caption = `Ih rapaz! ${targetName} marcou ${gayPercentage}% no viadômetro.\n\nVocê não é padeiro mas adora queimar a rosquinha, hein?! 🔥🏳️‍🌈`;
    } else if (gayPercentage <= 60) {
      imageName = "60.png";
      caption = `Ui! Tragam uma saia para a princesa! ${targetName} mediu ${gayPercentage}% de viadagem\n\nEsse é gay com força! 🏳️‍🌈`;
    } else if (gayPercentage <= 90) {
      imageName = "80.png";
      caption = `Com ${gayPercentage}%, ${targetName} atingiu o ápice da viadagem\n\nEsse faz amor com as mãos na parede! 🏳️‍🌈`;
    } else {
      imageName = "100.png";
      caption = `Está confirmado! ${targetName} atingiu ${gayPercentage}% de viadagem! Analisando... Esse aí calça 38, joga LOL, mora com os pais, faz xixi sentando e tem medo de mulher.\n\nIrei lhe coroar, o *Rei da Viadagem*! 👑🏳️‍🌈`;
    }

    const imagePath = path.join(ASSETS_DIR, "images", "gay", imageName);

    await sendImageFromFile(
      imagePath,
      caption,
      [targetJid]
    );
  },
};
