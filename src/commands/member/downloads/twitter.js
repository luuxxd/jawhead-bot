const { PREFIX } = require('../../../config');
const { InvalidParameterError, WarningError } = require('../../../errors');
const { scrapeTweetMedia } = require('../../../services/scrapers/twitterScraper');

module.exports = {
  name: "twitter",
  description: "Baixa mídias de um post do Twitter (X)",
  commands: ["twitter", "x"],
  usage: `${PREFIX}twitter [link_do_post]`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendReply,
    sendVideoFromURL,
    sendImageFromURL,
    sendErrorReply,
  }) => {
    const link = fullArgs?.trim();

    if (!link || (!link.includes("twitter.com") && !link.includes("x.com"))) {
      throw new InvalidParameterError("Você precisa enviar um link válido do Twitter/X!");
    }

    await sendWaitReact();

    try {
      const result = await scrapeTweetMedia(link);

      if (!result || !result.urls || result.urls.length === 0) {
        throw new Error("Erro ao baixar mídias.\nO post pode estar indisponível, privado ou protegido.");
      }

      await sendSuccessReact();
      await sendReply(`Enviando ${result.urls.length} mídia(s)...`);

      for (const mediaUrl of result.urls) {
        if (result.type === "video") {
          await sendVideoFromURL(mediaUrl);
        } else {
          await sendImageFromURL(mediaUrl);
        }
      }

    } catch (error) {
      console.error("Erro ao baixar mídias do Twitter:", error);
      await sendErrorReply("Erro! Erro ao baixar mídias.\nO post pode estar indisponível, privado ou protegido.");
    }
  },
};

