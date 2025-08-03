const { bot: { prefix: PREFIX } } = require(`${BASE_DIR}/settings.json`);
const axios = require('axios');

module.exports = {
  name: "hentai",
  description: "Envia uma imagem de uma personagem de anime sensual (SFW).",
  commands: ["hentai", "waifu"],
  usage: `${PREFIX}hentai`,

  handle: async ({ 
    sendReply, 
    sendWaitReact, 
    sendSuccessReact,
    sendImageFromURL
  }) => {

    await sendWaitReact();

    try {

      const apiUrl = `https://nekos.best/api/v2/waifu`;
      const response = await axios.get(apiUrl);

      const imageUrl = response.data.results[0].url;

      if (!imageUrl) {
        return sendReply("❌ Não consegui encontrar uma imagem no momento. Tente novamente.");
      }

      await sendSuccessReact();

      await sendImageFromURL(imageUrl, "Aqui está!", { isReply: true });

    } catch (error) {
        console.error("Erro ao buscar imagem na API nekos.best:", error);
        await sendReply(`❌ Ocorreu um erro ao buscar a imagem. A API pode estar offline.`);
    }
  },
};
